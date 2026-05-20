# OTT Bundle

OTT Bundle is a full-stack subscription bundle platform with a React/Vite frontend and an Express/MongoDB backend.

## Project Structure

- `frontend/` - React, Vite, Tailwind CSS, Redux, React Query, Three.js UI
- `backend/` - Express API, MongoDB/Mongoose models, auth, payments, OTT brand and pack management

## Prerequisites

- Node.js
- npm
- MongoDB connection string

## Setup

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Optional frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

## Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Git Notes

The repo ignores dependencies, build output, uploads, logs, and environment files. Do not commit `.env` files or uploaded payment/QR images.
