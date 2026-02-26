# 🏨 Smart Hostel Room Allocation System

A full-stack MERN application for managing hostel rooms and automatically allocating them to students based on capacity and facility requirements.

## 🚀 Live Demo link - https://smart-room-allocation-system.vercel.app/

- **Frontend:** [Deploy URL here]
- **Backend API:** [Deploy URL here]

---

## 📁 Project Structure

```
hostel-allocation/
├── backend/                  # Express + MongoDB API
│   ├── src/
│   │   ├── config/           # Database config
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Error handler, validators
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── utils/            # asyncHandler, AppError, apiResponse
│   │   ├── app.js            # Express app setup (CORS, middleware)
│   │   └── server.js         # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + Redux + Tailwind
    ├── src/
    │   ├── api/              # Axios instance + room service
    │   ├── components/
    │   │   ├── common/       # Navbar, StatCard, LoadingSpinner, etc.
    │   │   ├── rooms/        # RoomCard, Filters, AddEditModal
    │   │   └── allocation/   # AllocationForm
    │   ├── pages/            # Dashboard, RoomsPage, AddRoom, Allocate
    │   ├── store/            # Redux Toolkit store + roomSlice
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and FRONTEND_URL in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api (or your deployed backend URL)
npm run dev
```

---

## 🌐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hostel-allocation
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚢 Deployment

### Backend (Render)
1. Push to GitHub
2. Create a new **Web Service** on Render
3. Set `Root Directory` → `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### Frontend (Vercel / Netlify)
1. Push to GitHub
2. Import project on Vercel
3. Set `Root Directory` → `frontend`
4. Add `VITE_API_BASE_URL` → your Render backend URL
5. Deploy

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all rooms (supports filters) |
| POST | `/api/rooms` | Add a new room |
| GET | `/api/rooms/stats` | Get dashboard statistics |
| GET | `/api/rooms/:id` | Get a room by ID |
| PUT | `/api/rooms/:id` | Update a room |
| DELETE | `/api/rooms/:id` | Delete a room |
| POST | `/api/rooms/allocate` | Auto-allocate best-fit room |
| PATCH | `/api/rooms/:id/deallocate` | Free up a room |

### Query Params for `GET /api/rooms`
- `minCapacity` — minimum room capacity
- `hasAC` — `true` / `false`
- `hasAttachedWashroom` — `true` / `false`
- `isAllocated` — `true` / `false`

### Allocation Algorithm
`POST /api/rooms/allocate` body:
```json
{
  "students": 3,
  "needsAC": true,
  "needsWashroom": false,
  "groupName": "Batch A"
}
```
Finds the **smallest unallocated room** with `capacity >= students` that satisfies AC/washroom requirements. Returns `"No room available"` if none found.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Build Tool | Vite |

## ✅ Features

- ➕ Add/Edit/Delete hostel rooms
- 📋 View all rooms with status indicators
- 🔍 Filter rooms by capacity, AC, washroom, and status
- ⚡ Smart auto-allocation (best-fit algorithm)
- 📊 Dashboard with live statistics and occupancy bar
- 🔓 Deallocate rooms
- 📱 Fully responsive mobile-first UI
- 🛡️ Global error handling (frontend + backend)
- 🔒 CORS, rate limiting, Helmet security headers
