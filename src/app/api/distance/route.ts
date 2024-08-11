import { DATA } from '@/data/resume'
import { geolocation } from '@vercel/functions'

function getDistance(
  Lat1: number,
  Lon1: number,
  Lat2: number,
  Lon2: number,
  unit: 'miles' | 'km'
): number {
  const R = unit === 'miles' ? 3958.8 : 6371
  const rLat1 = (Math.PI * Lat1) / 180
  const rLat2 = (Math.PI * Lat2) / 180
  const dLat = rLat2 - rLat1
  const dLon = (Math.PI * (Lon2 - Lon1)) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export function GET(request: Request) {
  const geo = geolocation(request)

  if (!geo || !geo.country || !geo.latitude || !geo.longitude) {
    return new Response('Could not determine your location', { status: 400 })
  }

  const unit = geo.country === 'IN' ? 'km' : 'miles'
  const dist = getDistance(
    DATA.geo.lat,
    DATA.geo.lon,
    parseFloat(geo.latitude),
    parseFloat(geo.longitude),
    unit
  )

  const distance = `${dist} ${unit}`

  return new Response(distance, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
