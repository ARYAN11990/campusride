# 🚗 CampusRide — College Ride Sharing Platform

A fullstack ride-sharing web application built for college students. Post rides, search for available rides, book seats instantly, and chat with other users in real-time.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS v4
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io (chat)

## Features

- ✅ User Registration & Login (JWT auth)
- ✅ Post a Ride (source, destination, date, time, seats, price)
- ✅ Search Rides (filter by source, destination, date)
- ✅ Instant Booking (no approval required)
- ✅ Real-time Chat (Socket.io one-to-one messaging)
- ✅ User Dashboard (manage rides & bookings)
- ✅ Admin Dashboard (manage users & rides, view stats)
- ✅ Responsive Design (mobile-friendly)

## Prerequisites

1. **Node.js** (v18 or later) — [Download](https://nodejs.org/)
2. **MongoDB** — Running locally on `mongodb://localhost:27017`
   - Install [MongoDB Community](https://www.mongodb.com/try/download/community)
   - Or use [MongoDB Atlas](https://cloud.mongodb.com/) (update `.env` with your connection string)

## Quick Start

### 1. Clone & Navigate
```bash
cd "campusride first project"
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure Environment
Edit `backend/.env` if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusride
JWT_SECRET=campusride_secret_key_2024
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs at: **http://localhost:5000**

### 6. Start Frontend Dev Server (new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

### 7. Create Admin User
Register a normal user, then use MongoDB shell or Compass to set `role: "admin"`:
```js
db.users.updateOne({ email: "admin@college.edu" }, { $set: { role: "admin" } })
```

## Project Structure

```
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── rideController.js
│   │   ├── bookingController.js
│   │   ├── messageController.js
│   │   └── adminController.js
│   ├── middleware/auth.js      # JWT & admin middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Ride.js
│   │   ├── Booking.js
│   │   └── Message.js
│   ├── routes/                 # Express routes
│   │   ├── auth.js
│   │   ├── rides.js
│   │   ├── bookings.js
│   │   ├── messages.js
│   │   └── admin.js
│   ├── socket/chat.js         # Socket.io chat handler
│   ├── server.js              # Entry point
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RideCard.jsx
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PostRide.jsx
│   │   │   ├── SearchRide.jsx
│   │   │   ├── RideDetails.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/api.js    # Axios config
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register |
| POST | /api/auth/login | ✗ | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/rides | ✗ | All active rides |
| POST | /api/rides | ✓ | Create ride |
| GET | /api/rides/search | ✗ | Search rides |
| GET | /api/rides/:id | ✗ | Get ride |
| DELETE | /api/rides/:id | ✓ | Delete ride |
| POST | /api/bookings | ✓ | Book a ride |
| GET | /api/bookings/my | ✓ | My bookings |
| PUT | /api/bookings/:id/cancel | ✓ | Cancel booking |
| POST | /api/messages | ✓ | Send message |
| GET | /api/messages/conversations | ✓ | My conversations |
| GET | /api/messages/:otherId | ✓ | Get conversation |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| GET | /api/admin/rides | Admin | All rides |
| DELETE | /api/admin/rides/:id | Admin | Delete ride |

## License

MIT — Built for educational purposes.
