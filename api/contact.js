export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

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
      from: 'TFG <noreply@turingfig.com>',
      to: 'fernando.rey@turingfig.com',
      subject: subject || 'TFG Contact Form',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`
    }),
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to send email' });
  }

  res.writeHead(302, { Location: '/thanks.html' });
  res.end();
}
