import * as mailgun from 'mailgun-js';
import { ContactMessage } from '@shared/schema';

// Initialize Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || ''
});

/**
 * Sends a notification email about a new contact message
 * @param contactMessage The contact form submission data
 * @param sourceUrl The URL where the form was submitted from
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function sendContactNotification(
  contactMessage: ContactMessage, 
  sourceUrl: string
): Promise<boolean> {
  try {
    // Prepare the email data
    const data = {
      from: `American Chassis Depot Website <no-reply@${process.env.MAILGUN_DOMAIN}>`,
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

    // Send the email
    await mg.messages().send(data);
    return true;
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return false;
  }
}