
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
      to: ['sales@americanchassisdepot.com', 'alan@ceosnm.com'],
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

export async function sendCustomerConfirmationEmail(
  contactData: {
    name: string;
    email: string;
    company: string;
    phone: string;
    units: string;
    interest: string;
    message: string;
    chassisName?: string;
    chassisSlug?: string;
    actionType: 'quote' | 'brochure';
  },
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  if (!mg) {
    console.warn('Customer confirmation email skipped: Mailgun not configured');
    return false;
  }

  try {
    const isSpanish = language === 'es';
    const actionText = contactData.actionType === 'quote' 
      ? (isSpanish ? 'solicitud de cotización' : 'quote request')
      : (isSpanish ? 'descarga de folleto' : 'brochure download');
    
    const subject = isSpanish 
      ? `Confirmación de ${actionText} - American Chassis Depot`
      : `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Confirmation - American Chassis Depot`;

    const logoUrl = 'https://americanchassisdepot.com/assets/logo.png';
    
    const emailContent = isSpanish ? {
      greeting: `Hola ${contactData.name},`,
      thankYou: 'Gracias por tu interés en American Chassis Depot.',
      confirmation: `Hemos recibido tu ${actionText} para el producto:`,
      productInfo: contactData.chassisName ? `Producto: ${contactData.chassisName}` : 'Producto: General',
      nextSteps: contactData.actionType === 'quote' 
        ? 'Nuestro equipo de ventas revisará tu solicitud y se pondrá en contacto contigo en las próximas 24 horas con una cotización personalizada.'
        : 'El folleto técnico se ha descargado correctamente. Si tienes alguna pregunta sobre las especificaciones, no dudes en contactarnos.',
      contactInfo: 'Si tienes alguna pregunta urgente, puedes contactarnos directamente:',
      phone: 'Teléfono: +1 346 395 6739',
      email: 'Email: sales@americanchassisdepot.com',
      website: 'Sitio web: www.americanchassisdepot.com',
      footer: 'Saludos cordiales,\nEl equipo de American Chassis Depot'
    } : {
      greeting: `Hello ${contactData.name},`,
      thankYou: 'Thank you for your interest in American Chassis Depot.',
      confirmation: `We have received your ${actionText} for the product:`,
      productInfo: contactData.chassisName ? `Product: ${contactData.chassisName}` : 'Product: General',
      nextSteps: contactData.actionType === 'quote'
        ? 'Our sales team will review your request and contact you within the next 24 hours with a personalized quote.'
        : 'The technical brochure has been downloaded successfully. If you have any questions about the specifications, please don\'t hesitate to contact us.',
      contactInfo: 'If you have any urgent questions, you can contact us directly:',
      phone: 'Phone: +1 346 395 6739',
      email: 'Email: sales@americanchassisdepot.com',
      website: 'Website: www.americanchassisdepot.com',
      footer: 'Best regards,\nThe American Chassis Depot Team'
    };

    const data = {
      from: `American Chassis Depot <no-reply@${MAILGUN_DOMAIN}>`,
      to: contactData.email,
      subject: subject,
      text: `
${emailContent.greeting}

${emailContent.thankYou}

${emailContent.confirmation}
${emailContent.productInfo}

${emailContent.nextSteps}

${emailContent.contactInfo}
${emailContent.phone}
${emailContent.email}
${emailContent.website}

${emailContent.footer}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 200px; height: auto; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 10px; }
        .greeting { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        .product-info { background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .contact-info { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #B22234; text-align: center; }
        .accent { color: #B22234; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <img src="${logoUrl}" alt="American Chassis Depot" class="logo">
    </div>
    
    <div class="content">
        <div class="greeting">${emailContent.greeting}</div>
        
        <p>${emailContent.thankYou}</p>
        
        <p>${emailContent.confirmation}</p>
        
        <div class="product-info">
            <strong>${emailContent.productInfo}</strong>
        </div>
        
        <p>${emailContent.nextSteps}</p>
        
        <div class="contact-info">
            <p><strong>${emailContent.contactInfo}</strong></p>
            <p>${emailContent.phone}</p>
            <p>${emailContent.email}</p>
            <p>${emailContent.website}</p>
        </div>
        
        <p>${emailContent.footer}</p>
    </div>
    
    <div class="footer">
        <p style="color: #666; font-size: 12px;">
            American Chassis Depot<br>
            Your trusted partner in chassis solutions
        </p>
    </div>
</body>
</html>
      `
    };

    await mg.messages().send(data);
    return true;
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return false;
  }
}
