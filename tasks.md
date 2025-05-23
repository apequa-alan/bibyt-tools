## 🧱 PHASE 1: Project Bootstrap

---

### 🧩 TASK 1: Initialize Monorepo

**Goal:** Create root repo with two apps: React frontend, NestJS backend
**Steps:**

* Create repo: `telegram-miniapp`
* Set up base folder structure:

  * `/apps/frontend`
  * `/apps/backend`
* Add `.gitignore`, `README.md`

✅ *Test:* Can `ls` show both apps folders?

---

### ⚙️ TASK 2: Set up React project

**Goal:** Create Telegram-compatible React app with Vite
**Steps:**

* Init with `npm create vite@latest frontend --template react-ts`
* Install deps: `@supabase/supabase-js`, `zustand`
* Add `vite.config.ts`, alias paths
* Add `public/` and placeholder favicon

✅ *Test:* Can `npm run dev` launch at `http://localhost:3000`?

---

### ⚙️ TASK 3: Set up NestJS backend

**Goal:** Create backend scaffold using Nest CLI
**Steps:**

* `nest new backend` inside `/apps`
* Install: `@nestjs/config`, `@nestjs/typeorm`, `pg`
* Create `.env` file with DB placeholder URL

✅ *Test:* Can `npm run start:dev` run on port 4000?

---

## 🔑 PHASE 2: Auth & Supabase Setup

---

### 🔐 TASK 4: Create Supabase project

**Goal:** Initialize DB for users + snapshots
**Steps:**

* Go to [supabase.com](https://supabase.com), create project
* Create tables: `users`, `snapshots`
* Download service role key and project URL

✅ *Test:* Can you query `select * from users` via Supabase UI?

---

### 🔐 TASK 5: Integrate Supabase client in frontend

**Goal:** Set up `supabaseClient.ts`
**Steps:**

* Use `createClient(supabaseUrl, supabaseAnonKey)`
* Place in `lib/supabaseClient.ts`
* Export as singleton

✅ *Test:* Can `supabase.auth.getSession()` return null (logged out)?

---

### 🔐 TASK 6: Add Telegram WebApp auth flow

**Goal:** Parse and verify `initData` on frontend
**Steps:**

* Read from `window.Telegram.WebApp.initDataUnsafe.user`
* Save in `zustand` or React context
* Display greeting: "Welcome, {{user.username}}"

✅ *Test:* Open in Telegram → shows your TG name

---

## 🔐 PHASE 3: Backend Auth & Secure API Keys

---

### 🔐 TASK 7: Parse and verify Telegram initData (backend)

**Goal:** Nest guard that verifies Telegram WebApp signature
**Steps:**

* Use HMAC + token verification per [docs](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
* Implement `TelegramGuard`
* Attach to all protected routes

✅ *Test:* Request with invalid `initData` gets 401

---

### 🔐 TASK 8: Create users table + save user on login

**Goal:** Store Telegram user ID + username
**Steps:**

* NestJS: `/auth/login` reads `initData`, upserts user
* Save: `telegram_id`, `username`, `first_name`
* Return session JWT (if needed)

✅ *Test:* First login creates user row in Supabase

---

### 🔐 TASK 9: Add Bybit API key form (frontend)

**Goal:** UI page for inputting Bybit API key/secret
**Steps:**

* Route: `/auth`
* Controlled form with submit button
* POST to backend `/users/api-keys`

✅ *Test:* Entered keys appear in network request payload

---

### 🔐 TASK 10: Encrypt + store API keys in DB (backend)

**Goal:** AES-256 encrypt before DB insert
**Steps:**

* Use `crypto` module
* Store `bybit_api_key_enc`, `bybit_api_secret_enc`
* Do not return keys to frontend

✅ *Test:* Encrypted strings visible in `users` table

---

## 📊 PHASE 4: Bybit Integration

---

### 🔁 TASK 11: Add Bybit REST service (backend)

**Goal:** Create service that talks to Bybit API
**Steps:**

* Install `axios` or `bybit-api` SDK
* Method: `getPositions(userId, marketType)`
* Read + decrypt keys inside service

✅ *Test:* Service returns list of mock/fetch positions

---

### 🔁 TASK 12: Create `/positions` endpoint (backend)

**Goal:** Return Spot or Futures positions for user
**Steps:**

* Add GET `/positions?market=spot|futures`
* Use `TelegramGuard` + inject userId
* Return formatted array: symbol, qty, PnL, entryPrice

✅ *Test:* Valid call returns open positions list

---

### 📋 TASK 13: Fetch positions on frontend

**Goal:** Render user's positions after login
**Steps:**

* useEffect() → call `/positions`
* Render as cards in list
* Add TabSwitcher: Spot ↔ Futures

✅ *Test:* Switch tabs → see different positions

---

## ✂️ PHASE 5: Partial Close + Restore

---

### ✂️ TASK 14: Add percentage reducer input (frontend)

**Goal:** Input field + “Сократить” button
**Steps:**

* Text input or slider
* Button calls `POST /positions/reduce` with % value

✅ *Test:* Enter percent, click → sends correct payload

---

### ✂️ TASK 15: Implement partial close logic (backend)

**Goal:** Place market order to reduce positions
**Steps:**

* Calculate reduce-qty = openQty × %
* Place opposite-side order for reduce-qty
* Save snapshot to DB (symbol, qty, timestamp)

✅ *Test:* Snapshot record appears in DB

---

### ⏪ TASK 16: Check if snapshot exists (backend)

**Goal:** On login, check if positions were reduced
**Steps:**

* GET `/snapshots?market=spot`
* If any → return symbol + qty

✅ *Test:* Response shows which symbols can be restored

---

### ⏪ TASK 17: Display "Вернуть" button (frontend)

**Goal:** UI shows restore button if snapshot exists
**Steps:**

* If snapshot exists for symbol → show “Вернуть”
* On click → call `POST /snapshots/restore`

✅ *Test:* Button calls correct endpoint

---

### ⏪ TASK 18: Restore full position (backend)

**Goal:** Re-buy qtyClosed from snapshot
**Steps:**

* Read `qty_closed` from snapshot
* Place order with same qty, current price
* Remove snapshot after execution

✅ *Test:* Order placed, snapshot deleted

---

## 🧪 PHASE 6: Final Test Coverage

---

### ✅ TASK 19: Add test user + seed DB

**Goal:** Pre-fill Supabase with a test user
**Steps:**

* Insert row manually or via SQL
* Include encrypted dummy Bybit keys

✅ *Test:* Local dev can test without auth

---

### ✅ TASK 20: Add test script: reduce → restore

**Goal:** Verify core loop end-to-end
**Steps:**

* Script reduces 50% of all futures positions
* Then restores all via snapshot

✅ *Test:* Print: “✅ Reduced → ✅ Restored” in log
