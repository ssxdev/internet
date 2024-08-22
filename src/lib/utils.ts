import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const IS_SUBSCRIBED = 'isSubscribed'

export function formatDate(date: string) {
  let currentDate = new Date().getTime()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date).getTime()
  let timeDifference = Math.abs(currentDate - targetDate)
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  let fullDate = new Date(date).toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (daysAgo < 1) {
    return 'Today'
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7)
    return `${fullDate} (${weeksAgo}w ago)`
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30)
    return `${fullDate} (${monthsAgo}mo ago)`
  } else {
    const yearsAgo = Math.floor(daysAgo / 365)
    return `${fullDate} (${yearsAgo}y ago)`
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  if (error instanceof Array) {
    return error[0]
  }

  return 'System Error!'
}

export function EmailIsValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
