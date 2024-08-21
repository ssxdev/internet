'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function NewsletterCollectEmail() {
  const runEffectOnce = useRef(true)
  useEffect(() => {
    if (!runEffectOnce.current) return
    runEffectOnce.current = false
    setTimeout(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast(<Newsletter />, { duration: 20000 })
    })
  }, [])

  return null
}

function Newsletter() {
  return (
    <section className="flex w-full flex-col gap-2 text-center">
      <h2 className="text-lg font-extrabold tracking-tight text-secondary-foreground">
        Sign up for my blogs
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          const email = (e.target as any).elements[0].value
          handleEmailSubscription(email)
        }}
      >
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </form>
    </section>
  )
}

async function handleEmailSubscription(email: string) {
  console.log(`Subscribed with email: ${email}`)
}
