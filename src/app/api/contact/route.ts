import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const serviceId  = process.env.EMAILJS_SERVICE_ID
    const templateId = process.env.EMAILJS_TEMPLATE_ID
    const privateKey = process.env.EMAILJS_PRIVATE_KEY
    const publicKey  = process.env.EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !privateKey || !publicKey) {
      // EmailJS not configured — log and return success so the page still works
      console.log('[Contact] EmailJS not configured. Message received:', { name, email, message })
      return NextResponse.json({ ok: true, note: 'Logged (EmailJS not configured)' })
    }

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  serviceId,
        template_id: templateId,
        user_id:     publicKey,
        accessToken: privateKey,
        template_params: {
          from_name:    name,
          from_email:   email,
          message,
          to_name:      'Osman',
          reply_to:     email,
        },
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[Contact] EmailJS error:', text)
      return NextResponse.json({ error: 'Failed to send message. Try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
