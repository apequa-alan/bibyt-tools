import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import { useTelegramApp } from './hooks/useTelegramApp'
import { useStore } from './lib/store'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { telegramUser } = useStore()

  // Initialize Telegram WebApp
  useTelegramApp()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(session)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    checkSession()
  }, [])

  return (
    <div>
      <h1>Telegram Mini App</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <p>Session: {session ? 'Logged in' : 'Not logged in'}</p>
          {telegramUser && (
            <p>Welcome, {telegramUser.first_name || telegramUser.username || 'User'}!</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
