import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { authService } from '@/services/api'
import { Factory } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Confirming your email...')

  useEffect(() => {
    async function handleCallback() {
      if (!supabase) {
        navigate('/login')
        return
      }

      // Supabase puts the session in the URL hash/query after confirmation
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        setStatus('Confirmation failed. Please try registering again.')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      const { user } = data.session
      const name = user.user_metadata?.name || user.email.split('@')[0]

      // Create the Postgres row (idempotent — safe if already exists)
      try {
        await authService.register(name, user.email)
      } catch {
        // Non-fatal: row may already exist
      }

      setStatus('Email confirmed! Your account is under review.')
      // Sign back out — they can't log in until admin approves
      await supabase.auth.signOut()
      setTimeout(() => navigate('/login'), 3000)
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="bg-primary/10 p-4 rounded-2xl">
          <Factory size={36} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}
