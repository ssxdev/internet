import { DATA } from '@/data/resume'
import IPinfoWrapper, { LruCache, Options } from 'node-ipinfo'
import { getDistance, getErrorMessage } from '@/lib/utils'

export async function GET(request: Request) {
  const ipInfo = await getIpInfoGeo(request)
  return Response.json({
    ...ipInfo,
  })
}

async function getIpInfoGeo(request: Request) {
  const cacheOptions: Options<string, any> = {
    max: 5000, // 5000 max items in cache
    ttl: 24 * 1000 * 60 * 60, // 24 hours cache time
  }
  const cache = new LruCache(cacheOptions)
  const ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_TOKEN!, cache)

  try {
    let ip = request.headers.get('X-Forwarded-For')
    if (!ip) throw 'IP not found in headers'
    const ipInfo = await ipinfoWrapper.lookupIp(ip)

    if (!ipInfo.loc) throw 'Location not found in IP info'

    const ipInfolat = ipInfo.loc.split(',')[0]
    const ipInfolon = ipInfo.loc.split(',')[1]

    if (!ipInfolat || !ipInfolon)
      throw 'Latitude or Longitude not found in IP info'

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
