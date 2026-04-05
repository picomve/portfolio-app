import { Resend } from 'resend';
import { redirect } from 'next/navigation';

const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL ?? 'halilibrahim.ataylar@proton.me';
const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);

export async function sendContactEmail(formData: FormData) {
  'use server';

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email || !message) {
    redirect('/contact?status=missing-fields');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/contact?status=invalid-email');
  }

  if (!resendApiKey) {
    redirect('/contact?status=api-key-missing');
  }

  let sendError = false;

  try {
    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: email,
      subject: `Portfolio site contact form message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (result.error) {
      console.error('Email sending failed:', result.error);
      sendError = true;
    }
  } catch (error) {
    console.error('Email sending error:', error);
    sendError = true;
  }

  if (sendError) {
    redirect('/contact?status=error');
  }

  redirect('/contact?status=sent');
}
