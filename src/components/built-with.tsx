'use client'

import { useEffect, useMemo, useState } from 'react'

export function BuiltWith() {
  const emotions = useMemo(
    () => [
      '❤️',
      '😊',
      '😍',
      '🚀',
      '😢',
      '🥱',
      '😤',
      '🤩',
      '🥰',
      '😭',
      '🤔',
      '🤯',
      '🥳',
      '🥺',
      '😎',
      '😭',
      '😱',
    ],
    []
  )

  const [emotion, setEmotion] = useState(emotions[0])

  // change emotions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)])
    }, 300)

    return () => clearInterval(interval)
  }, [emotions])

  return (
    <div className="flex items-center justify-center space-x-2">
      <p className="text-muted-foreground">built with {emotion}</p>
    </div>
  )
}
