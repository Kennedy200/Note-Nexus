# 🎓 NoteNexus - Academic Notes Marketplace

> A collaborative notes-sharing platform for Caleb University students with a gamified economy system.

![NoteNexus Banner](https://via.placeholder.com/1200x300/4F46E5/ffffff?text=NoteNexus+-+Share+Knowledge,+Earn+Rewards)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

**NoteNexus** is a comprehensive academic notes marketplace built specifically for university students. It enables students to:

- 📚 **Share** their study notes with peers
- 💰 **Earn** NoteCoins for uploading quality content
- 🎯 **Purchase** premium notes from other students
- 📱 **Redeem** coins for real airtime on Nigerian networks
- ⭐ **Rate** and review notes to maintain quality

The platform uses a gamified economy system where students earn NoteCoins (NC) for contributing to the knowledge base and can spend them on premium resources or convert them to real value through airtime redemption.

---

## ✨ Features

### Core Features

- ✅ **University Email Authentication** - Secure signup with @calebuniversity.edu.ng emails
- ✅ **Note Upload System** - Upload PDF notes and earn 5 NC instantly
- ✅ **Browse & Search** - Advanced filtering by department, level, course code
- ✅ **Purchase System** - Buy notes using NoteCoins with automatic balance management
- ✅ **Wallet System** - Track earnings, spending, and transaction history
- ✅ **Airtime Redemption** - Convert NoteCoins to airtime (1 NC = ₦10)
- ✅ **Rating & Reviews** - 5-star rating system with text reviews
- ✅ **Profile Management** - Edit profile, change password, view stats
- ✅ **Search History** - Auto-save and reuse recent searches
- ✅ **Commission System** - Uploaders earn 70% commission on sales

### User Experience

- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 🔔 **Toast Notifications** - Beautiful, non-intrusive feedback system
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Instant balance updates and transaction tracking
- 🎯 **Smart Filtering** - Multi-criteria search and filter system

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + LocalStorage

### Backend

- **Framework**: FastAPI (Python)
- **Database**: SQLite + SQLAlchemy ORM
- **File Upload**: Multipart form handling
- **CORS**: Enabled for local development
- **Static Files**: Serve uploaded PDFs

### Database Models

- **Users** - Authentication, balance, profile
- **Notes** - Title, description, files, pricing, ratings
- **Transactions** - Complete financial history
- **Purchases** - Track user downloads
- **Ratings** - 5-star system with reviews
- **SearchHistory** - User search tracking
- **AirtimeRedemptions** - Redemption records

---

## 📥 Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-multipart --break-system-packages

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Database Initialization

Visit `http://localhost:8000/api/seed-notes` to populate the database with sample notes.

---

## 🚀 Usage

### 1. Create an Account

- Navigate to `/signup`
- Enter your full name, `@calebuniversity.edu.ng` email, and password
- You'll receive **10 NoteCoins** as a welcome bonus

### 2. Browse Notes

- Go to **Browse Notes** to explore available study materials
- Use filters to find notes by department, level, or course code
- Click on ratings to see detailed reviews

### 3. Upload Notes

- Click **Upload Note**
- Fill in details (title, description, course code, etc.)
- Upload a PDF file (max 10MB)
- Earn **5 NoteCoins** instantly!

### 4. Purchase Notes

- Free notes can be downloaded immediately
- Paid notes require NoteCoins
- Click **Unlock** to purchase
- File opens in a new tab after purchase

### 5. Redeem Airtime

- Go to **Wallet** → **Redeem Airtime**
- Enter your phone number (11 digits)
- Select network (MTN, Airtel, Glo, 9mobile)
- Choose amount (₦100, ₦200, ₦500, ₦1000)
- Confirm redemption (1 NC = ₦10)

### 6. Rate Notes

- Purchase a note to unlock rating
- Click on the star rating to view all reviews
- Submit your own rating (1-5 stars) and optional review

---

## 📁 Project Structure
Note-Nexus/
├── backend/
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── main.py              # FastAPI application
│   ├── notenexus.db         # SQLite database (auto-generated)
│   └── uploads/             # Uploaded PDF files
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Toast/
│   │   │   │   └── Toast.tsx           # Toast notification component
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   └── Dashboard/
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── BrowseNotes.tsx
│   │   │       ├── UploadNote.tsx
│   │   │       ├── MyUploads.tsx
│   │   │       ├── MyPurchases.tsx
│   │   │       ├── WalletPage.tsx
│   │   │       └── ProfilePage.tsx
│   │   ├── hooks/
│   │   │   └── useToast.tsx            # Toast context/hook
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

---

## 📡 API Documentation

### Authentication

#### POST `/api/signup`
Register a new user
```json
{
  "full_name": "John Doe",
  "email": "john.doe@calebuniversity.edu.ng",
  "password": "password123"
}
```

#### POST `/api/login`
Login user
```json
{
  "email": "john.doe@calebuniversity.edu.ng",
  "password": "password123"
}
```

### Notes

#### GET `/api/notes`
Retrieve all approved notes

#### POST `/api/notes/upload`
Upload a new note (multipart/form-data)

#### GET `/api/notes/{note_id}`
Get note details

#### GET `/api/notes/user/{user_id}`
Get user's uploaded notes

### Purchases

#### POST `/api/notes/purchase/{note_id}/{user_id}`
Purchase a note

#### GET `/api/purchases/{user_id}`
Get user's purchase history

### Wallet

#### GET `/api/wallet/balance/{user_id}`
Get current balance

#### GET `/api/wallet/transactions/{user_id}`
Get transaction history

#### GET `/api/wallet/stats/{user_id}`
Get wallet statistics

### Airtime

#### POST `/api/airtime/redeem/{user_id}`
Redeem airtime
```json
{
  "phone_number": "08012345678",
  "network": "MTN",
  "amount": 100
}
```

#### GET `/api/airtime/history/{user_id}`
Get redemption history

### Ratings

#### POST `/api/notes/{note_id}/rate`
Rate a note (multipart/form-data)

#### GET `/api/notes/{note_id}/ratings`
Get all ratings for a note

### Profile

#### GET `/api/profile/{user_id}`
Get user profile

#### PUT `/api/profile/{user_id}`
Update profile

#### PUT `/api/profile/{user_id}/password`
Change password

### Search

#### POST `/api/search/history`
Save search query

#### GET `/api/search/history/{user_id}`
Get search history

#### DELETE `/api/search/history/{user_id}`
Clear search history

---

## 📸 Screenshots

### Browse Notes
![Browse Notes](https://via.placeholder.com/1200x600/4F46E5/ffffff?text=Browse+Notes+Page)

### Upload Note
![Upload Note](https://via.placeholder.com/1200x600/10B981/ffffff?text=Upload+Note+Page)

### Wallet & Airtime
![Wallet](https://via.placeholder.com/1200x600/F59E0B/ffffff?text=Wallet+Page)

### Rating System
![Ratings](https://via.placeholder.com/1200x600/EF4444/ffffff?text=Rating+System)

---

## 🎯 Key Highlights

### Economy System
- **Welcome Bonus**: 10 NC on signup
- **Upload Reward**: 5 NC per note
- **Sales Commission**: 70% to uploader, 30% platform fee
- **Airtime Conversion**: 1 NC = ₦10

### Security Features
- ✅ University email validation
- ✅ Balance validation before transactions
- ✅ Duplicate purchase prevention
- ✅ File type validation (PDF only)
- ✅ Phone number format validation

### UX Enhancements
- ✅ Auto-save search history
- ✅ Animated toast notifications
- ✅ Real-time balance updates
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Contact

**Developer**: Forkhive  
**University**: Caleb University  
**Email**: contact@notenexus.com  
**Project Link**: [https://github.com/yourusername/note-nexus](https://github.com/yourusername/note-nexus)

---

## 🙏 Acknowledgments

- Caleb University for the inspiration
- All students who contribute notes to the platform
- FastAPI and React communities for excellent documentation

---

## 📝 Future Enhancements

- [ ] Email notifications for purchases
- [ ] Admin dashboard for note moderation
- [ ] Live chat support
- [ ] Mobile app (React Native)
- [ ] Integration with real VTU API (VTPass/Flutterwave)
- [ ] Data bundle redemption
- [ ] Referral program
- [ ] Leaderboard system
- [ ] Note preview before purchase
- [ ] Export transaction history to PDF

---

**Made with ❤️ for Caleb University Students**

---

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
python main.py

# Frontend (new terminal)
cd frontend
npm run dev

# Seed Database
# Visit: http://localhost:8000/api/seed-notes

# Access App
# Visit: http://localhost:5173
```

---

**⭐ Star this repo if you find it useful!**# Note-Nexus
