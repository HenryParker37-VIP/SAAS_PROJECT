# SaaS Dashboard

Full-stack SaaS analytics dashboard with real-time data visualization, user authentication, and transaction management.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Auth**: JWT token-based authentication
- **Real-time**: Socket.io for live transaction updates
- **Charts**: Recharts (line, bar, pie)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed   # Seed demo data
npm run dev    # Start on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # Start on port 5173
```

### Demo Credentials

- **Email**: demo@example.com
- **Password**: demo123

## Features

- User signup/login with JWT auth
- Dashboard with metric cards, charts, and data table
- Line chart (monthly revenue), bar chart (product sales), pie chart (regions)
- Transaction table with sorting, filtering, search, and pagination
- CSV export
- Real-time transaction updates via WebSocket
- Dark/light mode toggle
- Fully responsive design
- Toast notifications

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login, returns JWT |
| POST | /api/auth/logout | Logout |
| GET | /api/user/profile | Get user profile |
| GET | /api/dashboard | Dashboard summary |
| GET | /api/dashboard/transactions | Filtered transactions |
| POST | /api/dashboard/export | Export CSV |

## Project Structure

```
backend/src/
  server.ts          - Express + Socket.io server
  models/User.ts     - User model with bcrypt
  models/DashboardData.ts - Transaction model
  routes/auth.ts     - Auth endpoints
  routes/dashboard.ts - Dashboard/transaction endpoints
  middleware/auth.ts  - JWT middleware
  seed.ts            - Database seeder

frontend/src/
  App.tsx             - Router + providers
  context/            - Auth, Theme, Toast contexts
  pages/              - Login, Signup, Dashboard, Transactions, Settings
  components/         - Sidebar, MetricCard, Charts, DataTable, Toasts
  hooks/              - useAuth, useDashboardData, useTransactions
  lib/                - API client, utilities
```
