# Weekly Report Generator & Team Dashboard

Full-stack MERN app: team members submit structured weekly reports, managers view and
analyze them across the team through a dashboard.

**Stack:** React (Vite) + Tailwind + Recharts (frontend) · Node.js/Express + Mongoose (backend) · MongoDB

## Project Structure

```
weekly-report-app/
├── backend/          # Express API, MongoDB models, JWT auth, role-based access
└── frontend/         # React app (Vite), team member + manager views
```

## 1. Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)

## 2. Installing Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd frontend
npm install
```

## 3. Running the Database

If running MongoDB locally:

```bash
mongod --dbpath /path/to/your/data/directory
```

Or use a free MongoDB Atlas cluster and copy its connection string into `MONGO_URI`
(step 4 below).

## 4. Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weekly_reports
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## 5. (Optional) Seed Sample Data

Creates 1 manager + 2 team members + 2 projects so you can log in immediately without
registering:

```bash
cd backend
npm run seed
```

Login credentials after seeding:
- `manager@example.com` / `password123` (manager)
- `member1@example.com` / `password123` (member)
- `member2@example.com` / `password123` (member)

## 6. Running Backend

```bash
cd backend
npm run dev      # nodemon, auto-restarts on changes
# or: npm start
```

API runs on `http://localhost:5000`.

## 7. Running Frontend

```bash
cd frontend
npm run dev
```

App runs on `http://localhost:5173`.

## Roles & Access

- **Team Member**: create/edit/submit own weekly reports, view own report history.
- **Manager**: everything above, plus the Team Dashboard, project management, and
  filtered views across all team members' reports. Role-based access is enforced both
  on the frontend (route guarding) and backend (middleware on every protected route).

## Key API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/projects` | Authenticated |
| POST/PUT/DELETE | `/api/projects` | Manager |
| POST | `/api/reports` | Team Member |
| GET | `/api/reports/mine` | Team Member |
| PUT | `/api/reports/:id` | Owner or Manager |
| GET | `/api/reports/team?week=&project=&member=` | Manager |
| GET | `/api/dashboard/summary` | Manager |
| GET | `/api/dashboard/charts/tasks-trend` | Manager |
| GET | `/api/dashboard/charts/submission-status` | Manager |
| GET | `/api/dashboard/charts/workload-by-project` | Manager |
| GET | `/api/dashboard/activity` | Manager |

## Notes on Design Decisions

- **Fixed report structure**: the report schema and form fields are hard-coded identically
  for every user (week range, project, tasks completed/planned, blockers, hours, notes) —
  per the assignment, this keeps reports comparable across the team on the dashboard.
- **JWT auth**: token issued on login/register, sent via `Authorization: Bearer` header,
  verified by Express middleware which attaches `req.user` for downstream role checks.
- **Compliance rate**: calculated as submitted reports ÷ total active members for the
  selected week — surfaced on the dashboard summary cards.

## Not Yet Implemented / Possible Improvements

- AI Chat Assistant (marked "Good to Have" in the assignment) — not included in this pass;
  a natural next step would be a `/api/chat` endpoint that does a lightweight RAG lookup
  over each week's `Report` documents before calling an LLM.
- Email/notification reminders for pending reports.
- Pagination on report history and team tables (fine for a small team, but would need it
  at scale).

## ER Diagram

See `ER_DIAGRAM.md` in this folder — a Mermaid diagram you can paste into
https://mermaid.live to view or export.
