export default async function handler(req, res) {
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  console.log("🔑 ENV KEY:", process.env.RESEND_API_KEY);


  const { name, email, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TFG <onboarding@resend.dev>', // TEMPORAL para probar
      to: 'fernando.rey@turingfig.com',
      subject: subject || 'TFG Contact Form',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    }),
  });

if (!response.ok) {
  const errorText = await response.text();
  console.log("Resend error:", response.status, errorText);
  return res.status(500).json({ error: 'Failed to send email', details: errorText });
}

  res.writeHead(302, { Location: '/thanks.html' });
  res.end();
}
