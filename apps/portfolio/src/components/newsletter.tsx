'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { EmailIsValid, getErrorMessage, SanitizeEmail } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconSpinner } from './ui/icons'

export function NewsletterCollectEmail() {
  const runEffectOnce = useRef(true)
  useEffect(() => {
    if (!runEffectOnce.current) return
    runEffectOnce.current = false
    setTimeout(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast(<Newsletter />, { duration: Infinity })
    })
  }, [])

  return null
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sanitizedEmail = SanitizeEmail(email)
    if (!sanitizedEmail) {
      setError('We need your email to subscribe')
      return
    }
    if (!EmailIsValid(sanitizedEmail)) {
      setError('Please enter valid email')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizedEmail }),
      })
      const { message } = await res.json()
      if (!res.ok) throw message
      toast.success(message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      toast.dismiss()
    }
  }

  return (
    <section className="flex w-full flex-col gap-2 text-center">
      <label className="text-lg font-extrabold tracking-tight text-secondary-foreground">
        Sign up for my blogs
      </label>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button disabled={loading} type="submit">
            {loading ? <IconSpinner /> : 'Subscribe'}
          </Button>
        </div>
        {error ? (
          <Label className="text-destructive">{error}</Label>
        ) : (
          <Label>I promise not to spam you</Label>
        )}
      </form>
    </section>
  )
}
