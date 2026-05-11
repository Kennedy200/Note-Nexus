from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    coin_balance = Column(Integer, default=10)
    phone_number = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transactions = relationship("Transaction", back_populates="owner")
    notes = relationship("Note", back_populates="uploader")
    purchases = relationship("Purchase", back_populates="buyer")
    airtime_redemptions = relationship("AirtimeRedemption", back_populates="user")
    ratings = relationship("Rating", back_populates="user")
    search_history = relationship("SearchHistory", back_populates="user")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    course_code = Column(String)
    department = Column(String)
    level = Column(String)
    file_url = Column(String)
    thumbnail = Column(String, nullable=True)
    price = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_approved = Column(Boolean, default=True)

    uploader = relationship("User", back_populates="notes")
    purchases = relationship("Purchase", back_populates="note")
    ratings = relationship("Rating", back_populates="note")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer)
    transaction_type = Column(String)
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="transactions")

class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    note_id = Column(Integer, ForeignKey("notes.id"))
    amount_paid = Column(Integer)
    purchased_at = Column(DateTime, default=datetime.datetime.utcnow)

    buyer = relationship("User", back_populates="purchases")
    note = relationship("Note", back_populates="purchases")

class AirtimeRedemption(Base):
    __tablename__ = "airtime_redemptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone_number = Column(String)
    network = Column(String)
    amount = Column(Integer)
    coins_spent = Column(Integer)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="airtime_redemptions")

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    note_id = Column(Integer, ForeignKey("notes.id"))
    rating = Column(Integer)  # 1-5 stars
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ratings")
    note = relationship("Note", back_populates="ratings")

class SearchHistory(Base):
    __tablename__ = "search_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    search_query = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="search_history")