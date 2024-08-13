'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function NewsletterCollectEmail() {
  const runEffectOnce = useRef(true)
  useEffect(() => {
    if (!runEffectOnce.current) return
    runEffectOnce.current = false
    setTimeout(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Hello there! 🎉')
    })
  }, [])

  return null
}
