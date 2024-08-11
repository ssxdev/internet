'use client'

import { useEffect, useRef, useState } from 'react'
import BlurFadeText from './magicui/blur-fade-text'

const BLUR_FADE_DELAY = 0.04

export function Distance() {
  const [distance, setDistance] = useState<string | null>(null)
  const runOnce = useRef(false)

  useEffect(() => {
    const fetchDistance = () => {
      if (runOnce.current) return
      runOnce.current = true

      fetch('/api/distance').then(res => {
        if (res.ok) {
          res.text().then(dist => {
            setDistance(dist)
          })
        }
      })
    }

    fetchDistance()
  }, [])

  return (
    distance !== null && (
      <BlurFadeText
        className="text-sm text-muted-foreground"
        delay={BLUR_FADE_DELAY}
        text={`We're ${distance} apart, yet my work is within your reach.`}
      />
    )
  )
}
