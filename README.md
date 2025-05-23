# Telegram Mini App for Bybit Tools

A Telegram Mini App that helps users manage their Bybit positions with features for partial closing and restoring positions.

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: NestJS
- Database & Auth: Supabase
- Trading API: Bybit

## Project Structure

```
/telegram-miniapp
├── apps/
│   ├── frontend/     # React.js Telegram Mini App
│   └── backend/      # NestJS API
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd apps/frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Set up environment variables (see `.env.example` files in each app)
4. Start development servers:
   ```bash
   # Frontend (port 3000)
   cd apps/frontend
   npm run dev

   # Backend (port 4000)
   cd ../backend
   npm run start:dev
   ```

## Features

- Telegram authentication
- Secure storage of Bybit API keys
- View open positions (Spot & Futures)
- Partial close positions by percentage
- Restore previously closed positions

## License

MIT 