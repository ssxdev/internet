import { DATA } from '@/data/resume'

export default function Resume() {
  return (
    <iframe
      src={DATA.resumeUrl}
      className="h-dvh w-full"
      allow="autoplay"
    ></iframe>
  )
}
