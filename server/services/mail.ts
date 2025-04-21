
import mailgun from 'mailgun-js';
import { ContactMessage } from '@shared/schema';

// Only initialize Mailgun if credentials are available
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  console.error('ERROR: Missing Mailgun credentials. MAILGUN_API_KEY and MAILGUN_DOMAIN are required.');
}

const mg = MAILGUN_API_KEY && MAILGUN_DOMAIN ? mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
  timeout: 10000 // 10 second timeout
}) : null;

console.log('Mailgun Configuration Status:', {
  hasApiKey: !!MAILGUN_API_KEY,
  hasDomain: !!MAILGUN_DOMAIN,
  isInitialized: !!mg
});

export async function sendContactNotification(
  contactMessage: ContactMessage, 
  sourceUrl: string
): Promise<boolean> {
  if (!mg) {
    console.warn('Email notification skipped: Mailgun not configured');
    return false;
  }

  try {
    const data = {
      from: `American Chassis Depot Website <no-reply@${MAILGUN_DOMAIN}>`,
      to: 'alan@ceosnm.com',
      subject: `New Contact Form Submission from ${contactMessage.name}`,
      text: `
New contact form submission from the American Chassis Depot website.

Submission Details:
-------------------
Name: ${contactMessage.name}
Email: ${contactMessage.email}
Phone: ${contactMessage.phone || 'Not provided'}
Company: ${contactMessage.company || 'Not provided'}
Number of Units: ${contactMessage.units || 'Not provided'}
Interested In: ${contactMessage.interest || 'Not specified'}
Source URL: ${sourceUrl}
Submitted on: ${new Date(contactMessage.createdAt).toLocaleString()}

Message:
${contactMessage.message}
      `,
      html: `
<h2>New contact form submission from the American Chassis Depot website.</h2>

<h3>Submission Details:</h3>
<table style="border-collapse: collapse; width: 100%;">
  <tr style="background-color: #f2f2f2;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.name}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.email}</td>
  </tr>
  <tr style="background-color: #f2f2f2;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.phone || 'Not provided'}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.company || 'Not provided'}</td>
  </tr>
  <tr style="background-color: #f2f2f2;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Number of Units:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.units || 'Not provided'}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Interested In:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${contactMessage.interest || 'Not specified'}</td>
  </tr>
  <tr style="background-color: #f2f2f2;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Source URL:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${sourceUrl}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted on:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${new Date(contactMessage.createdAt).toLocaleString()}</td>
  </tr>
</table>

<h3>Message:</h3>
<p style="white-space: pre-line; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${contactMessage.message}</p>
      `
    };

    await mg.messages().send(data);
    return true;
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return false;
  }
}
