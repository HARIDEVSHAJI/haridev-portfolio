import nodemailer from 'nodemailer'

export async function sendContactEmail({
  name, email, message,
}: {
  name: string; email: string; message: string
}) {
  // Validate env vars
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Gmail credentials not set — skipping email send')
    return
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  // Verify connection
  await transporter.verify()

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // sends to yourself
    replyTo: email,
    subject: `📬 Portfolio Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#03030a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#08080f;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#00e5ff,#818cf8);padding:3px 0;"></div>
          <div style="padding:40px;">
            <h2 style="color:#00e5ff;margin:0 0 6px;font-size:22px;">New Portfolio Message</h2>
            <p style="color:#404858;margin:0 0 32px;font-size:13px;">Someone reached out via your portfolio contact form</p>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;color:#8892a4;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">From</p>
              <p style="margin:0 0 4px;color:#eef0ff;font-size:18px;font-weight:600;">${name}</p>
              <a href="mailto:${email}" style="color:#00e5ff;font-size:14px;text-decoration:none;">${email}</a>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;">
              <p style="margin:0 0 12px;color:#8892a4;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
              <p style="margin:0;color:#eef0ff;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <div style="margin-top:32px;text-align:center;">
              <a href="mailto:${email}?subject=Re: Your message on haridev.dev"
                style="display:inline-block;background:linear-gradient(135deg,#00e5ff,#0096c7);color:#020208;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.04em;">
                Reply to ${name}
              </a>
            </div>
          </div>
          <div style="background:linear-gradient(135deg,#00e5ff,#818cf8);padding:3px 0;"></div>
        </div>
      </body>
      </html>
    `,
  })
}
