# NexusDesk CRM — Customer Support Ticketing System

A production-ready, full-stack Customer Support CRM with a futuristic glassmorphism UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python FastAPI + SQLAlchemy + SQLite |
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion + Three.js / React Three Fiber |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## Project Structure

```
nexusdesk/
├── backend/
│   ├── app/
│   │   ├── database/       # SQLAlchemy engine + session
│   │   ├── models/         # ORM models (Ticket, Note)
│   │   ├── routes/         # FastAPI routers
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic layer
│   │   └── main.py         # App entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route-level page components
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start dev server
npm run dev
```

App available at: http://localhost:5173

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./support_crm.db` | Database connection string |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets` | List tickets (filter + search + paginate) |
| `GET` | `/api/tickets/analytics` | Get ticket count analytics |
| `GET` | `/api/tickets/{ticket_id}` | Get ticket details with notes |
| `PUT` | `/api/tickets/{ticket_id}` | Update status/priority, add note |
| `DELETE` | `/api/tickets/{ticket_id}` | Delete a ticket |

### Query Parameters for `GET /api/tickets`

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `open`, `in_progress`, `closed` |
| `priority` | string | Filter: `low`, `medium`, `high`, `urgent` |
| `search` | string | Full-text search across ID, name, email, subject, description |
| `page` | int | Page number (default: 1) |
| `limit` | int | Results per page (default: 20, max: 100) |

---

## Deployment

### Backend → Railway

1. Push your code to GitHub.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Select the `backend` folder as the root directory.
4. Add environment variables in Railway dashboard:
   - `DATABASE_URL` — Railway provides a Postgres URL if you add a Postgres plugin, or keep SQLite for simple deploys.
   - `ALLOWED_ORIGINS` — your Vercel frontend URL, e.g. `https://nexusdesk.vercel.app`
5. Set the start command:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Railway auto-detects Python and installs `requirements.txt`.

### Frontend → Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_BASE_URL` = your Railway backend URL, e.g. `https://nexusdesk-api.up.railway.app`
5. Vercel auto-detects Vite and runs `npm run build`.
6. Deploy.

---

## Features

- **Auto-generated Ticket IDs** — sequential `TKT-0001` format
- **Live Search** — debounced search across ID, name, email, subject, description
- **Status Filtering** — Open / In Progress / Closed tabs
- **Priority Badges** — Low / Medium / High / Urgent
- **Ticket Notes** — internal comments with author attribution
- **Analytics Dashboard** — animated counters, bar chart, pie chart, priority breakdown
- **3D Hero Scene** — Three.js holographic orb with orbiting rings and particles
- **Glassmorphism UI** — dark mode, neon gradients, animated cards
- **Framer Motion** — page transitions, hover effects, counter animations
- **Toast Notifications** — success/error feedback
- **Responsive Design** — mobile-first, works on all screen sizes
- **Pagination** — server-side pagination with page controls

---

## License

MIT
