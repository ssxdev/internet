import { cookies } from 'next/headers'
import { EmailIsValid, getErrorMessage, IS_SUBSCRIBED } from '@/lib/utils'

export async function POST(request: Request) {
  const cookieStore = cookies()

  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return Response.json(
        { message: 'Only application/json is accepted' },
        { status: 400 }
      )
    }

    const { email } = await request.json()
    if (!email) {
      return Response.json(
        { message: 'We need your email to subscribe' },
        { status: 400 }
      )
    }

    const santizedEmail = SanitizeEmail(email)
    if (!EmailIsValid(santizedEmail)) {
      return Response.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Todo: Store email to DB
    throw 'Feature not implemented yet'

    cookieStore.set(IS_SUBSCRIBED, 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return Response.json({
      email: santizedEmail,
      message: 'Subscribed successfully',
    })
  } catch (error) {
    return Response.json({ message: getErrorMessage(error) }, { status: 500 })
  }
}

function SanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
