-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    bybit_api_key_enc TEXT,
    bybit_api_secret_enc TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create snapshots table
CREATE TABLE snapshots (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    qty_closed DECIMAL NOT NULL,
    closed_price DECIMAL NOT NULL,
    market_type TEXT NOT NULL CHECK (market_type IN ('spot', 'futures')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_market_type CHECK (market_type IN ('spot', 'futures'))
);

-- Create indexes for better query performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_snapshots_user_id ON snapshots(user_id);
CREATE INDEX idx_snapshots_created_at ON snapshots(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Snapshots are only accessible by the user who created them
CREATE POLICY "Users can view own snapshots" ON snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots" ON snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own snapshots" ON snapshots
    FOR DELETE USING (auth.uid() = user_id); 