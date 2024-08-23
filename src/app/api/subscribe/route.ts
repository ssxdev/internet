import { cookies } from 'next/headers'
import Email from '@/model/newsletter/email.model'
import { connectDB } from '@/lib/connectDB'
import {
  EmailIsValid,
  getErrorMessage,
  IS_SUBSCRIBED,
  SanitizeEmail,
} from '@/lib/utils'

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

    await connectDB()

    const existingEmail = await Email.findOne({ email: santizedEmail })
    if (existingEmail) {
      return Response.json(
        { message: 'You have already subscribed' },
        { status: 409 }
      )
    }

    await Email.create({ email: santizedEmail })

    cookieStore.set(IS_SUBSCRIBED, 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return Response.json({
      email: santizedEmail,
      message: 'Thank you for subscribing',
    })
  } catch (error) {
    return Response.json({ message: getErrorMessage(error) }, { status: 500 })
  }
}
