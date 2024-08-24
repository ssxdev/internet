import { NextRequest } from 'next/server'
import { DATA } from '@/data/resume'
import IPinfoWrapper, { LruCache, Options } from 'node-ipinfo'
import { getDistance, getErrorMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  return Response.json({
    ...getIpInfoGeo(request),
    vercel: getVercelGeo(request),
  })
}

async function getIpInfoGeo(request: NextRequest) {
  const cacheOptions: Options<string, any> = {
    max: 5000, // 5000 max items in cache
    ttl: 24 * 1000 * 60 * 60, // 24 hours cache time
  }
  const cache = new LruCache(cacheOptions)
  const ipinfoWrapper = new IPinfoWrapper('fc7d32ac2a371d', cache)

  try {
    let ip = request.headers.get('X-Forwarded-For')
    if (!ip) throw 'IP not found in headers'
    const ipInfo = await ipinfoWrapper.lookupIp(ip)

    const ipInfolat = ipInfo.loc.split(',')[0]
    const ipInfolon = ipInfo.loc.split(',')[1]

    const ipDist = getDistance(
      DATA.geo.lat,
      DATA.geo.lon,
      parseFloat(ipInfolat),
      parseFloat(ipInfolon),
      ipInfo.countryCode === 'IN' ? 'km' : 'miles'
    )

    return {
      distance: ipDist,
      ...ipInfo,
    }
  } catch (error) {
    console.error('Error in ipInfo:', error)
    return {
      error: getErrorMessage(error),
    }
  }
}

function getVercelGeo(request: NextRequest) {
  try {
    const vercelGeo = request.geo
    let vercelDist
    if (
      vercelGeo &&
      vercelGeo.country &&
      vercelGeo.latitude &&
      vercelGeo.longitude
    ) {
      vercelDist = getDistance(
        DATA.geo.lat,
        DATA.geo.lon,
        parseFloat(vercelGeo.latitude),
        parseFloat(vercelGeo.longitude),
        vercelGeo.country === 'IN' ? 'km' : 'miles'
      )
    }
    return {
      distance: vercelDist,
      geo: vercelGeo,
      ip: request.ip,
    }
  } catch (error) {
    console.error('Error in vercelGeo:', error)
    return {
      error: getErrorMessage(error),
    }
  }
}
