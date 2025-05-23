Here's a full-stack **Telegram Mini App architecture** using **React.js (frontend)**, **Nest.js (backend)**, and **Supabase** (auth + DB) to implement your first feature — **partial close & restore of Bybit positions**.

---

## 🧠 Feature Summary

* **User auth** via Telegram (`initData`) + Supabase JWT sessions.
* **On first open**: prompt for **Bybit API keys**, store securely (encrypted).
* **Main tool page**:

  * Tab switcher: **Spot** ↔ **Futures**
  * List of **open positions**
  * Input: **percentage**
  * Action: “**Сократить**”
  * If previously reduced — show option to “**Вернуть**”

---

## 🏗️ Folder & File Structure

```
/telegram-miniapp
│
├── apps/
│   ├── frontend/               # React.js Telegram Mini App
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/     # PositionCard, Header, PercentageInput, TabSwitcher
│   │   │   ├── pages/          # Home.tsx (main logic), Auth.tsx (add API keys)
│   │   │   ├── hooks/          # useAuth, usePositions, useBybitActions
│   │   │   ├── lib/            # supabaseClient.ts, api.ts
│   │   │   └── App.tsx
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── backend/               # Nest.js API
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/          # Telegram verification + Supabase auth linking
│       │   ├── users/         # Store Bybit keys securely (AES encrypted)
│       │   ├── bybit/         # BybitService + REST + WebSocket clients
│       │   ├── positions/     # Partial close, restore, sync positions
│       │   ├── snapshots/     # Record % reduction snapshots
│       │   └── common/        # Crypto utils, guards, interceptors
│       └── .env
│
├── supabase/                  # SQL schema + Edge functions (optional)
│   ├── schema.sql             # users, snapshots, api_keys tables
│
├── docker-compose.yml         # For local dev (frontend + backend + postgres)
└── README.md
```

---

## ⚙️ Core Modules & Responsibilities

### Frontend (React)

**Key files:**

* `pages/Home.tsx`: loads user info + keys; if absent → redirect to `/auth`.
* `pages/Auth.tsx`: Telegram login + form to add Bybit API keys.
* `components/PositionCard.tsx`: display position, buttons for "Сократить" and "Вернуть".
* `hooks/usePositions.ts`: fetches from `/positions`, includes spot/futures switch.
* `hooks/useBybitActions.ts`: call `/positions/reduce` or `/snapshots/restore`.

**State:**

* Auth state via Supabase.
* UI state in Zustand or React context (e.g. `positions`, `selectedMarket`, `percentToReduce`).

---

### Backend (Nest.js)

**Modules:**

#### 1. `auth/`

* Verifies Telegram `initData`
* Issues Supabase-compatible JWT if needed (or links user via `telegram_id`)
* Middleware guard for requests.

#### 2. `users/`

* Save/retrieve **Bybit API keys** (encrypted in DB using AES-256).
* Each user has:

  ```ts
  { id, telegram_id, bybit_api_key_enc, bybit_api_secret_enc }
  ```

#### 3. `bybit/`

* REST calls via [bybit-api](https://github.com/bybit-exchange/bybit-official-api-docs)
* `BybitService.getPositions(marketType)`
* `BybitService.placeOrder(symbol, side, qty)`
* Wraps retry logic and error handling.

#### 4. `positions/`

* Endpoint: `GET /positions?marketType=spot`
  → returns user's open positions.
* Endpoint: `POST /positions/reduce`
  → reduce all by % (calculated on server).
* Endpoint: `GET /positions/snapshot`
  → check for existing snapshots.

#### 5. `snapshots/`

* Table to track reduced position data:

  ```sql
  user_id, symbol, qty_closed, market_type, closed_price, timestamp
  ```
* Allows restoration: `POST /snapshots/restore`

---

### Supabase (Postgres + Auth)

**Tables:**

```sql
-- users (optional, can be pure Supabase auth)
id uuid PRIMARY KEY,
telegram_id text UNIQUE,
bybit_api_key_enc text,
bybit_api_secret_enc text

-- snapshots
id serial,
user_id uuid,
symbol text,
qty_closed decimal,
closed_price decimal,
market_type text, -- 'spot' | 'futures'
created_at timestamptz
```

* Use Supabase Edge Functions or direct REST for auth from frontend.
* Encrypt/decrypt API keys **server-side only** with per-user secret + master key.

---

## 🔐 Security Design

### Bybit API Key Storage

* Keys **never** touch the frontend.
* On form submit:

  * `POST /users/api-keys` → backend encrypts using:

    ```ts
    AES.encrypt(apiKey, user.id + process.env.MASTER_SECRET)
    ```
  * Store encrypted strings in Postgres.

### Telegram Auth (Safe flow)

* Client uses `Telegram.WebApp.initData`
* Server verifies it via [Telegram docs](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
* On first open → redirect to add keys.

---

## 🌐 Service Connections

| Service   | Connects to       | Purpose                                  |
| --------- | ----------------- | ---------------------------------------- |
| React app | Supabase Auth     | Auth, session storage                    |
| React app | Nest API          | Bybit ops: get positions, reduce/restore |
| Nest API  | Supabase DB       | Store users + snapshots                  |
| Nest API  | Bybit API         | Retrieve + place orders                  |
| Nest API  | Supabase Auth API | Optional session validation              |

---

## 📦 Docker Compose (local dev)

```yaml
services:
  frontend:
    build: ./apps/frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./apps/backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://...
      - MASTER_SECRET=super-secret
    depends_on:
      - db

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
```

---

## ✅ What to Build First

| Step | Task                                                 |
| ---- | ---------------------------------------------------- |
| 1    | Set up `supabase` project + `users` table            |
| 2    | Create React app → Telegram login → API keys form    |
| 3    | Build NestJS backend: Auth flow, key encryption      |
| 4    | Integrate Bybit REST: getPositions, placeOrder       |
| 5    | Build reducer/restore logic + snapshot DB            |
| 6    | UI: tabs + percent input + “Сократить/Вернуть” logic |

---
