from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
import models, database
from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime
import shutil
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

models.Base.metadata.create_all(bind=database.engine)

# --- SCHEMAS ---
class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AdminSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AirtimeRedeemRequest(BaseModel):
    phone_number: str
    network: str
    amount: int

# ============================================================
# ROOT
# ============================================================
@app.get("/")
def read_root():
    return {"message": "NoteNexus Server is Running"}

# ============================================================
# AUTH ROUTES
# ============================================================
@app.post("/api/signup")
def signup(user_data: UserSignup, db: Session = Depends(database.get_db)):
    if not user_data.email.lower().endswith("@calebuniversity.edu.ng"):
        raise HTTPException(status_code=400, detail="Only @calebuniversity.edu.ng emails allowed")
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=user_data.password,
        coin_balance=10
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    signup_trans = models.Transaction(
        user_id=new_user.id,
        amount=10,
        transaction_type="SIGNUP_BONUS",
        description="Welcome bonus - 10 NoteCoins"
    )
    db.add(signup_trans)
    db.commit()
    return {"message": "Account created", "user_id": new_user.id}

@app.post("/api/login")
def login(login_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or user.hashed_password != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "coin_balance": user.coin_balance,
            "phone_number": user.phone_number
        }
    }

# ============================================================
# ADMIN AUTH ROUTES
# ============================================================
@app.post("/api/admin/signup")
def admin_signup(admin_data: AdminSignup, db: Session = Depends(database.get_db)):
    existing = db.query(models.Admin).filter(models.Admin.email == admin_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Admin email already registered")
    new_admin = models.Admin(
        full_name=admin_data.full_name,
        email=admin_data.email,
        hashed_password=admin_data.password,
        role="admin"
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {
        "message": "Admin account created successfully",
        "admin": {
            "id": new_admin.id,
            "full_name": new_admin.full_name,
            "email": new_admin.email,
            "role": new_admin.role
        }
    }

@app.post("/api/admin/login")
def admin_login(login_data: AdminLogin, db: Session = Depends(database.get_db)):
    admin = db.query(models.Admin).filter(models.Admin.email == login_data.email).first()
    if not admin or admin.hashed_password != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid admin email or password")
    return {
        "admin": {
            "id": admin.id,
            "full_name": admin.full_name,
            "email": admin.email,
            "role": admin.role
        }
    }

# ============================================================
# ADMIN DASHBOARD ROUTES
# ============================================================
@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(database.get_db)):
    total_users = db.query(models.User).count()
    total_notes = db.query(models.Note).count()
    total_transactions = db.query(models.Transaction).count()
    total_airtime = db.query(models.AirtimeRedemption).count()
    total_purchases = db.query(models.Purchase).count()
    pending_notes = db.query(models.Note).filter(models.Note.is_approved == False).count()
    approved_notes = db.query(models.Note).filter(models.Note.is_approved == True).count()
    total_coins_earned = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.amount > 0
    ).scalar() or 0
    total_coins_spent = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.amount < 0
    ).scalar() or 0
    total_airtime_naira = db.query(func.sum(models.AirtimeRedemption.amount)).filter(
        models.AirtimeRedemption.status == "SUCCESS"
    ).scalar() or 0
    return {
        "total_users": total_users,
        "total_notes": total_notes,
        "total_transactions": total_transactions,
        "total_airtime_redemptions": total_airtime,
        "total_purchases": total_purchases,
        "pending_notes": pending_notes,
        "approved_notes": approved_notes,
        "total_coins_in_circulation": int(total_coins_earned),
        "total_coins_spent": abs(int(total_coins_spent)),
        "total_airtime_naira": int(total_airtime_naira)
    }

@app.get("/api/admin/users")
def get_all_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).order_by(desc(models.User.created_at)).all()
    result = []
    for user in users:
        uploads = db.query(models.Note).filter(models.Note.uploader_id == user.id).count()
        purchases = db.query(models.Purchase).filter(models.Purchase.user_id == user.id).count()
        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "coin_balance": user.coin_balance,
            "phone_number": user.phone_number,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "total_uploads": uploads,
            "total_purchases": purchases
        })
    return result

@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.query(models.Transaction).filter(models.Transaction.user_id == user_id).delete()
    db.query(models.Purchase).filter(models.Purchase.user_id == user_id).delete()
    db.query(models.Rating).filter(models.Rating.user_id == user_id).delete()
    db.query(models.SearchHistory).filter(models.SearchHistory.user_id == user_id).delete()
    db.query(models.AirtimeRedemption).filter(models.AirtimeRedemption.user_id == user_id).delete()
    db.query(models.Note).filter(models.Note.uploader_id == user_id).delete()
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.put("/api/admin/users/{user_id}/toggle")
def toggle_user_status(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "is_active": user.is_active}

@app.get("/api/admin/notes")
def get_all_notes_admin(db: Session = Depends(database.get_db)):
    notes = db.query(models.Note).order_by(desc(models.Note.created_at)).all()
    result = []
    for note in notes:
        uploader = db.query(models.User).filter(models.User.id == note.uploader_id).first()
        result.append({
            "id": note.id,
            "title": note.title,
            "description": note.description,
            "course_code": note.course_code,
            "department": note.department,
            "level": note.level,
            "price": note.price,
            "rating": note.rating,
            "rating_count": note.rating_count,
            "download_count": note.download_count,
            "is_approved": note.is_approved,
            "thumbnail": note.thumbnail,
            "file_url": note.file_url,
            "created_at": note.created_at,
            "uploader_name": uploader.full_name if uploader else "Seeded Note",
            "uploader_email": uploader.email if uploader else "system@notenexus.com"
        })
    return result

@app.put("/api/admin/notes/{note_id}/approve")
def approve_note(note_id: int, db: Session = Depends(database.get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.is_approved = True
    db.commit()
    return {"message": "Note approved successfully"}

@app.put("/api/admin/notes/{note_id}/reject")
def reject_note(note_id: int, db: Session = Depends(database.get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.is_approved = False
    db.commit()
    return {"message": "Note rejected successfully"}

@app.delete("/api/admin/notes/{note_id}")
def delete_note_admin(note_id: int, db: Session = Depends(database.get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.query(models.Rating).filter(models.Rating.note_id == note_id).delete()
    db.query(models.Purchase).filter(models.Purchase.note_id == note_id).delete()
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

@app.get("/api/admin/transactions")
def get_all_transactions(db: Session = Depends(database.get_db)):
    transactions = db.query(models.Transaction).order_by(desc(models.Transaction.timestamp)).all()
    result = []
    for t in transactions:
        user = db.query(models.User).filter(models.User.id == t.user_id).first()
        result.append({
            "id": t.id,
            "user_name": user.full_name if user else "Unknown",
            "user_email": user.email if user else "Unknown",
            "amount": t.amount,
            "transaction_type": t.transaction_type,
            "description": t.description,
            "timestamp": t.timestamp
        })
    return result

@app.get("/api/admin/airtime")
def get_all_airtime(db: Session = Depends(database.get_db)):
    redemptions = db.query(models.AirtimeRedemption).order_by(desc(models.AirtimeRedemption.created_at)).all()
    result = []
    for r in redemptions:
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append({
            "id": r.id,
            "user_name": user.full_name if user else "Unknown",
            "user_email": user.email if user else "Unknown",
            "phone_number": r.phone_number,
            "network": r.network,
            "amount": r.amount,
            "coins_spent": r.coins_spent,
            "status": r.status,
            "created_at": r.created_at
        })
    return result

# ============================================================
# NOTES ROUTES
# ============================================================
@app.get("/api/notes")
def get_notes(db: Session = Depends(database.get_db)):
    notes = db.query(models.Note).filter(models.Note.is_approved == True).all()
    return notes

@app.get("/api/notes/{note_id}")
def get_note_detail(note_id: int, db: Session = Depends(database.get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.post("/api/notes/upload")
async def upload_note(
    title: str = Form(...),
    description: str = Form(...),
    course_code: str = Form(...),
    department: str = Form(...),
    level: str = Form(...),
    price: int = Form(...),
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    timestamp = int(datetime.datetime.now().timestamp())
    file_name = f"{timestamp}_{course_code.replace(' ', '_')}.pdf"
    file_path = UPLOAD_DIR / file_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    new_note = models.Note(
        title=title,
        description=description,
        course_code=course_code,
        department=department,
        level=level,
        price=price,
        file_url=f"http://localhost:8000/uploads/{file_name}",
        thumbnail="https://picsum.photos/seed/" + course_code.replace(' ', '') + "/800/600",
        uploader_id=user_id,
        is_approved=True
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.coin_balance += 5
    upload_reward = models.Transaction(
        user_id=user_id,
        amount=5,
        transaction_type="UPLOAD_REWARD",
        description=f"Reward for uploading: {title}"
    )
    db.add(upload_reward)
    db.commit()
    return {
        "message": "Note uploaded successfully",
        "note_id": new_note.id,
        "coins_earned": 5,
        "new_balance": user.coin_balance
    }

@app.get("/api/notes/user/{user_id}")
def get_user_notes(user_id: int, db: Session = Depends(database.get_db)):
    notes = db.query(models.Note).filter(models.Note.uploader_id == user_id).all()
    return notes

# ============================================================
# PURCHASE ROUTES
# ============================================================
@app.post("/api/notes/purchase/{note_id}/{user_id}")
def purchase_note(note_id: int, user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not user or not note:
        raise HTTPException(status_code=404, detail="User or Note not found")
    existing_purchase = db.query(models.Purchase).filter(
        models.Purchase.user_id == user_id,
        models.Purchase.note_id == note_id
    ).first()
    if existing_purchase:
        return {"message": "Already purchased", "file_url": note.file_url, "new_balance": user.coin_balance}
    if user.coin_balance < note.price:
        raise HTTPException(status_code=400, detail=f"Insufficient NoteCoins. You need {note.price} NC but only have {user.coin_balance} NC")
    user.coin_balance -= note.price
    note.download_count += 1
    new_purchase = models.Purchase(user_id=user_id, note_id=note_id, amount_paid=note.price)
    db.add(new_purchase)
    new_trans = models.Transaction(
        user_id=user.id,
        amount=-note.price,
        transaction_type="PURCHASE",
        description=f"Purchased: {note.title}"
    )
    db.add(new_trans)
    if note.uploader_id and note.uploader_id != user_id:
        uploader = db.query(models.User).filter(models.User.id == note.uploader_id).first()
        if uploader:
            commission = int(note.price * 0.7)
            uploader.coin_balance += commission
            uploader_reward = models.Transaction(
                user_id=note.uploader_id,
                amount=commission,
                transaction_type="SALES_REWARD",
                description=f"Sale of: {note.title}"
            )
            db.add(uploader_reward)
    db.commit()
    db.refresh(user)
    return {"message": "Purchase successful", "new_balance": user.coin_balance, "file_url": note.file_url}

@app.get("/api/purchases/{user_id}")
def get_user_purchases(user_id: int, db: Session = Depends(database.get_db)):
    purchases = db.query(models.Purchase).filter(
        models.Purchase.user_id == user_id
    ).order_by(desc(models.Purchase.purchased_at)).all()
    result = []
    for purchase in purchases:
        note = db.query(models.Note).filter(models.Note.id == purchase.note_id).first()
        result.append({
            "id": purchase.id,
            "note": {
                "id": note.id,
                "title": note.title,
                "course_code": note.course_code,
                "thumbnail": note.thumbnail,
                "file_url": note.file_url
            },
            "amount_paid": purchase.amount_paid,
            "purchased_at": purchase.purchased_at
        })
    return result

# ============================================================
# WALLET ROUTES
# ============================================================
@app.get("/api/wallet/balance/{user_id}")
def get_wallet_balance(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"coin_balance": user.coin_balance}

@app.get("/api/wallet/transactions/{user_id}")
def get_transactions(user_id: int, db: Session = Depends(database.get_db)):
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id
    ).order_by(desc(models.Transaction.timestamp)).all()
    return transactions

@app.get("/api/wallet/stats/{user_id}")
def get_wallet_stats(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    total_earned_result = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.amount > 0
    ).scalar()
    total_earned = total_earned_result if total_earned_result else 0
    total_spent_result = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.amount < 0
    ).scalar()
    total_spent = abs(total_spent_result) if total_spent_result else 0
    uploads_count = db.query(models.Note).filter(models.Note.uploader_id == user_id).count()
    purchases_count = db.query(models.Purchase).filter(models.Purchase.user_id == user_id).count()
    return {
        "current_balance": user.coin_balance,
        "total_earned": int(total_earned),
        "total_spent": int(total_spent),
        "uploads": uploads_count,
        "purchases": purchases_count
    }

# ============================================================
# AIRTIME ROUTES
# ============================================================
@app.post("/api/airtime/redeem/{user_id}")
def redeem_airtime(user_id: int, request: AirtimeRedeemRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    coins_needed = request.amount // 10
    if user.coin_balance < coins_needed:
        raise HTTPException(status_code=400, detail=f"Insufficient coins. You need {coins_needed} NC but only have {user.coin_balance} NC")
    if not request.phone_number.startswith('0') or len(request.phone_number) != 11:
        raise HTTPException(status_code=400, detail="Invalid phone number. Must be 11 digits starting with 0")
    user.coin_balance -= coins_needed
    if request.phone_number:
        user.phone_number = request.phone_number
    redemption = models.AirtimeRedemption(
        user_id=user_id,
        phone_number=request.phone_number,
        network=request.network,
        amount=request.amount,
        coins_spent=coins_needed,
        status="SUCCESS"
    )
    db.add(redemption)
    transaction = models.Transaction(
        user_id=user_id,
        amount=-coins_needed,
        transaction_type="AIRTIME_REDEEM",
        description=f"{request.network} ₦{request.amount} airtime to {request.phone_number}"
    )
    db.add(transaction)
    db.commit()
    db.refresh(user)
    return {
        "message": "Airtime redeemed successfully",
        "amount": request.amount,
        "coins_spent": coins_needed,
        "new_balance": user.coin_balance,
        "phone": request.phone_number,
        "network": request.network
    }

@app.get("/api/airtime/history/{user_id}")
def get_airtime_history(user_id: int, db: Session = Depends(database.get_db)):
    redemptions = db.query(models.AirtimeRedemption).filter(
        models.AirtimeRedemption.user_id == user_id
    ).order_by(desc(models.AirtimeRedemption.created_at)).all()
    return redemptions

# ============================================================
# PROFILE ROUTES
# ============================================================
@app.get("/api/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "coin_balance": user.coin_balance,
        "created_at": user.created_at
    }

@app.put("/api/profile/{user_id}")
def update_profile(
    user_id: int,
    full_name: str = Form(...),
    phone_number: str = Form(None),
    bio: str = Form(None),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.full_name = full_name
    user.phone_number = phone_number
    user.bio = bio
    db.commit()
    db.refresh(user)
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "bio": user.bio
        }
    }

@app.put("/api/profile/{user_id}/password")
def change_password(
    user_id: int,
    current_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.hashed_password != current_password:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.hashed_password = new_password
    db.commit()
    return {"message": "Password changed successfully"}

# ============================================================
# RATING ROUTES
# ============================================================
@app.post("/api/notes/{note_id}/rate")
def rate_note(
    note_id: int,
    user_id: int = Form(...),
    rating: int = Form(...),
    review: str = Form(None),
    db: Session = Depends(database.get_db)
):
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.price > 0:
        purchase = db.query(models.Purchase).filter(
            models.Purchase.user_id == user_id,
            models.Purchase.note_id == note_id
        ).first()
        if not purchase:
            raise HTTPException(status_code=403, detail="You must purchase this note before rating it")
    existing_rating = db.query(models.Rating).filter(
        models.Rating.user_id == user_id,
        models.Rating.note_id == note_id
    ).first()
    if existing_rating:
        existing_rating.rating = rating
        existing_rating.review = review
    else:
        new_rating = models.Rating(user_id=user_id, note_id=note_id, rating=rating, review=review)
        db.add(new_rating)
    all_ratings = db.query(models.Rating).filter(models.Rating.note_id == note_id).all()
    if len(all_ratings) > 0:
        note.rating = round(sum([r.rating for r in all_ratings]) / len(all_ratings), 1)
        note.rating_count = len(all_ratings)
    else:
        note.rating = 0.0
        note.rating_count = 0
    db.commit()
    return {"message": "Rating submitted successfully", "new_average": note.rating, "total_ratings": note.rating_count}

@app.get("/api/notes/{note_id}/ratings")
def get_note_ratings(note_id: int, db: Session = Depends(database.get_db)):
    ratings = db.query(models.Rating).filter(models.Rating.note_id == note_id).all()
    result = []
    for rating in ratings:
        user = db.query(models.User).filter(models.User.id == rating.user_id).first()
        result.append({
            "id": rating.id,
            "rating": rating.rating,
            "review": rating.review,
            "user_name": user.full_name if user else "Unknown",
            "created_at": rating.created_at
        })
    return result

# ============================================================
# SEARCH HISTORY ROUTES
# ============================================================
@app.post("/api/search/history")
def save_search_history(
    user_id: int = Form(...),
    search_query: str = Form(...),
    db: Session = Depends(database.get_db)
):
    if not search_query or search_query.strip() == "":
        return {"message": "Empty search not saved"}
    five_minutes_ago = datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
    recent_search = db.query(models.SearchHistory).filter(
        models.SearchHistory.user_id == user_id,
        models.SearchHistory.search_query == search_query,
        models.SearchHistory.created_at > five_minutes_ago
    ).first()
    if recent_search:
        return {"message": "Search already recorded"}
    search = models.SearchHistory(user_id=user_id, search_query=search_query)
    db.add(search)
    db.commit()
    return {"message": "Search saved"}

@app.get("/api/search/history/{user_id}")
def get_search_history(user_id: int, db: Session = Depends(database.get_db)):
    searches = db.query(models.SearchHistory).filter(
        models.SearchHistory.user_id == user_id
    ).order_by(desc(models.SearchHistory.created_at)).limit(10).all()
    return searches

@app.delete("/api/search/history/{user_id}")
def clear_search_history(user_id: int, db: Session = Depends(database.get_db)):
    db.query(models.SearchHistory).filter(models.SearchHistory.user_id == user_id).delete()
    db.commit()
    return {"message": "Search history cleared"}

# ============================================================
# SEED ROUTE
# ============================================================
@app.get("/api/seed-notes")
def seed_notes(db: Session = Depends(database.get_db)):
    db.query(models.Note).delete()
    db.commit()
    sample_notes = [
        models.Note(title="Advanced Data Structures & Algorithms", description="Comprehensive notes covering Trees, Graphs, Dynamic Programming, and Advanced Sorting", course_code="CSC 301", department="Computer Science", level="300L", price=0, rating=4.9, rating_count=45, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/cs301/800/600", download_count=234),
        models.Note(title="Constitutional Law II - Complete Lecture Notes", description="Full semester notes with case studies and exam prep materials", course_code="LAW 202", department="Law", level="200L", price=5, rating=4.7, rating_count=32, file_url="https://www.africau.edu/images/default/sample.pdf", thumbnail="https://picsum.photos/seed/law202/800/600", download_count=189),
        models.Note(title="Media Ethics & Professional Practice", description="Ethics codes, case studies, and professional standards in journalism", course_code="MAC 401", department="Mass Comm", level="400L", price=10, rating=4.8, rating_count=28, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/mac401/800/600", download_count=156),
        models.Note(title="Discrete Mathematics - Sets, Logic & Proofs", description="Mathematical foundations for CS students with solved examples", course_code="MTH 201", department="Computer Science", level="200L", price=0, rating=4.5, rating_count=67, file_url="https://www.africau.edu/images/default/sample.pdf", thumbnail="https://picsum.photos/seed/mth201/800/600", download_count=298),
        models.Note(title="Introduction to Python Programming", description="From basics to OOP - Perfect for beginners with code examples", course_code="CSC 101", department="Computer Science", level="100L", price=0, rating=4.9, rating_count=89, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/csc101/800/600", download_count=412),
        models.Note(title="Business Administration Fundamentals", description="Core concepts in management, marketing, and business strategy", course_code="BUS 101", department="Business", level="100L", price=3, rating=4.2, rating_count=41, file_url="https://www.africau.edu/images/default/sample.pdf", thumbnail="https://picsum.photos/seed/bus101/800/600", download_count=167),
        models.Note(title="Financial Accounting Principles", description="Double-entry bookkeeping, financial statements, and analysis", course_code="ACC 201", department="Accounting", level="200L", price=8, rating=4.6, rating_count=53, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/acc201/800/600", download_count=203),
        models.Note(title="Organic Chemistry Lab Manual", description="Lab procedures, safety protocols, and experiment reports", course_code="CHM 301", department="Chemistry", level="300L", price=12, rating=4.7, rating_count=36, file_url="https://www.africau.edu/images/default/sample.pdf", thumbnail="https://picsum.photos/seed/chm301/800/600", download_count=145),
        models.Note(title="Introduction to Economics", description="Microeconomics and macroeconomics fundamentals", course_code="ECO 101", department="Economics", level="100L", price=0, rating=4.4, rating_count=72, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/eco101/800/600", download_count=321),
        models.Note(title="Engineering Mechanics - Statics", description="Force systems, equilibrium, structures, and friction", course_code="ENG 201", department="Engineering", level="200L", price=7, rating=4.6, rating_count=44, file_url="https://www.africau.edu/images/default/sample.pdf", thumbnail="https://picsum.photos/seed/eng201/800/600", download_count=198),
        models.Note(title="Criminal Law and Procedure", description="Nigerian criminal law, prosecution, and defense", course_code="LAW 301", department="Law", level="300L", price=6, rating=4.5, rating_count=38, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/law301/800/600", download_count=176),
        models.Note(title="Digital Marketing Strategies", description="SEO, social media, content strategy, and analytics", course_code="BUS 301", department="Business", level="300L", price=9, rating=4.8, rating_count=61, file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", thumbnail="https://picsum.photos/seed/bus301/800/600", download_count=287),
    ]
    db.add_all(sample_notes)
    db.commit()
    return {"message": "Database seeded with 12 notes"}

# ============================================================
# LEADERBOARD ROUTES
# ============================================================
@app.get("/api/leaderboard/coins")
def get_coins_leaderboard(db: Session = Depends(database.get_db)):
    """Top 10 users by NoteCoins balance"""
    users = db.query(models.User).filter(
        models.User.is_active == True
    ).order_by(desc(models.User.coin_balance)).limit(10).all()
    
    result = []
    for index, user in enumerate(users):
        uploads = db.query(models.Note).filter(
            models.Note.uploader_id == user.id,
            models.Note.is_approved == True
        ).count()
        purchases = db.query(models.Purchase).filter(
            models.Purchase.user_id == user.id
        ).count()
        total_earned = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.user_id == user.id,
            models.Transaction.amount > 0
        ).scalar() or 0
        result.append({
            "rank": index + 1,
            "id": user.id,
            "full_name": user.full_name,
            "coin_balance": user.coin_balance,
            "total_uploads": uploads,
            "total_purchases": purchases,
            "total_earned": int(total_earned),
            "joined": user.created_at
        })
    return result

@app.get("/api/leaderboard/notes")
def get_notes_leaderboard(db: Session = Depends(database.get_db)):
    """Top 10 users by number of approved notes uploaded"""
    from sqlalchemy import case
    
    users = db.query(models.User).filter(
        models.User.is_active == True
    ).all()
    
    result = []
    for user in users:
        uploads = db.query(models.Note).filter(
            models.Note.uploader_id == user.id,
            models.Note.is_approved == True
        ).count()
        if uploads == 0:
            continue
        total_downloads = db.query(func.sum(models.Note.download_count)).filter(
            models.Note.uploader_id == user.id,
            models.Note.is_approved == True
        ).scalar() or 0
        total_earned = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.user_id == user.id,
            models.Transaction.transaction_type == "SALES_REWARD"
        ).scalar() or 0
        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "total_uploads": uploads,
            "total_downloads": int(total_downloads),
            "total_earned_from_sales": int(total_earned),
            "coin_balance": user.coin_balance,
            "joined": user.created_at
        })
    
    # Sort by uploads descending
    result.sort(key=lambda x: x["total_uploads"], reverse=True)
    
    # Add rank
    for index, item in enumerate(result[:10]):
        item["rank"] = index + 1
    
    return result[:10]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)