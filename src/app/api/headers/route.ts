import { NextRequest } from 'next/server'
import { geolocation, ipAddress } from '@vercel/functions'

export function GET(request: NextRequest) {
  return Response.json({
    message: 'GET request to /api/headers',
    headers: request.headers,
    ip: request.ip,
    geo: request.geo,
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-vercel-ip-country': request.headers.get('x-vercel-ip-country'),
    'x-vercel-ip-country-region': request.headers.get(
      'x-vercel-ip-country-region'
    ),
    'x-vercel-ip-city': request.headers.get('x-vercel-ip-city'),
    'x-vercel-ip-latitude': request.headers.get('x-vercel-ip-latitude'),
    'x-vercel-ip-longitude': request.headers.get('x-vercel-ip-longitude'),
    'vercel-function-ip': ipAddress(request),
    'vercel-function-geo': geolocation(request),
  })
}
