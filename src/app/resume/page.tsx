import { redirect } from 'next/navigation'
import { DATA } from '@/data/resume'

export default function Resume() {
  redirect(DATA.resumeUrl)
}
