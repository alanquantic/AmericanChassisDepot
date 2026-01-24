import sgMail from '@sendgrid/mail';
import { ContactMessage } from '@shared/schema';
import { processFormSubmission } from './odoo.js';

// =============================================
// SENDGRID CONFIGURATION
// =============================================
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'sales@americanchassisdepot.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'American Chassis Depot';
const ADMIN_EMAIL = process.env.MARKETPLACE_ADMIN_EMAIL || 'sales@americanchassisdepot.com';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized successfully');
} else {
  console.warn('⚠️ SendGrid API key not configured. Email notifications will be disabled.');
}

console.log('SendGrid Configuration Status:', {
  hasApiKey: !!SENDGRID_API_KEY,
  fromEmail: FROM_EMAIL,
  adminEmail: ADMIN_EMAIL
});

// Generic email sender
async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('Email skipped: SendGrid API key not configured');
    return false;
  }

  try {
    await sgMail.send({
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });
    console.log(`✅ Email sent successfully to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    return false;
  }
}

// =============================================
// EMAIL TEMPLATES
// =============================================

function getBaseEmailTemplate(content: string, language: 'en' | 'es' = 'en'): string {
  const footer = language === 'es' 
    ? `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #B22234; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          American Chassis Depot<br>
          4811 N McCarty St Suite C, Houston, TX 77013<br>
          <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a> | 
          <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
        </p>
        <p style="color: #999; font-size: 10px;">
          © ${new Date().getFullYear()} American Chassis Depot. Todos los derechos reservados.
        </p>
      </div>
    `
    : `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #B22234; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          American Chassis Depot<br>
          4811 N McCarty St Suite C, Houston, TX 77013<br>
          <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a> | 
          <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
        </p>
        <p style="color: #999; font-size: 10px;">
          © ${new Date().getFullYear()} American Chassis Depot. All rights reserved.
        </p>
      </div>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #0A3161 0%, #1a4a8a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <img src="https://americanchassisdepot.com/assets/logo.png" alt="American Chassis Depot" style="max-width: 180px; height: auto;">
      </div>
      <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${content}
        ${footer}
      </div>
    </body>
    </html>
  `;
}

// =============================================
// CONTACT FORM NOTIFICATIONS
// =============================================

export async function sendContactNotification(
  contactMessage: ContactMessage, 
  sourceUrl: string
): Promise<boolean> {
  // INTEGRACIÓN CON ODOO - Crear lead automáticamente
  try {
    const language = sourceUrl?.includes('/es/') ? 'es' : 'en';
    
    // Determinar tipo de acción basado en el mensaje
    let actionType: 'contact' | 'quote' | 'brochure' = 'contact';
    if (contactMessage.message?.toLowerCase().includes('cotización') || 
        contactMessage.message?.toLowerCase().includes('quote')) {
      actionType = 'quote';
    } else if (contactMessage.message?.toLowerCase().includes('brochure') || 
               contactMessage.message?.toLowerCase().includes('folleto')) {
      actionType = 'brochure';
    }

    // Extraer información del producto si está disponible
    let product = undefined;
    if (contactMessage.interest) {
      product = contactMessage.interest;
    }

    // Procesar en Odoo
    const odooResult = await processFormSubmission({
      name: contactMessage.name,
      email: contactMessage.email,
      company: contactMessage.company || '',
      phone: contactMessage.phone || '',
      message: contactMessage.message,
      source: sourceUrl,
      product,
      actionType,
      language,
      units: contactMessage.units || undefined,
      interest: contactMessage.interest || undefined
    });

    if (odooResult.success) {
      console.log('✅ Lead creado exitosamente en Odoo:', {
        leadId: odooResult.odooLeadId,
        contactId: odooResult.odooContactId
      });
    } else {
      console.warn('⚠️ Error creando lead en Odoo:', odooResult.message);
    }

  } catch (odooError) {
    console.error('❌ Error en integración con Odoo:', odooError);
    // Continuar con el envío de email aunque falle Odoo
  }

  // Send notification to admins via SendGrid
  const adminContent = `
    <h2 style="color: #0A3161; margin-top: 0;">📬 New Contact Form Submission</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactMessage.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${contactMessage.email}" style="color: #0A3161;">${contactMessage.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${contactMessage.phone ? `<a href="tel:${contactMessage.phone}" style="color: #0A3161;">${contactMessage.phone}</a>` : 'Not provided'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactMessage.company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Units Needed:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactMessage.units || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Interested In:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactMessage.interest || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Source URL:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="${sourceUrl}" style="color: #0A3161; word-break: break-all;">${sourceUrl}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Submitted:</td>
          <td style="padding: 10px;">${new Date(contactMessage.createdAt).toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Message</h3>
      <p style="white-space: pre-line; margin-bottom: 0;">${contactMessage.message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:${contactMessage.email}?subject=Re: Your inquiry to American Chassis Depot" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Reply to Customer
      </a>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `📬 New Contact: ${contactMessage.name} - ${contactMessage.interest || 'General Inquiry'}`,
    html: getBaseEmailTemplate(adminContent),
    replyTo: contactMessage.email,
  });
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
  const isSpanish = language === 'es';
  
  const actionText = contactData.actionType === 'quote' 
    ? (isSpanish ? 'solicitud de cotización' : 'quote request')
    : (isSpanish ? 'descarga de folleto' : 'brochure download');

  const content = isSpanish ? `
    <h2 style="color: #0A3161; margin-top: 0;">¡Gracias por contactarnos!</h2>
    
    <p>Hola ${contactData.name},</p>
    
    <p>Hemos recibido tu ${actionText} y nuestro equipo la está revisando.</p>
    
    ${contactData.chassisName ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Producto de Interés</h3>
        <p style="margin-bottom: 0; font-weight: bold;">${contactData.chassisName}</p>
        ${contactData.chassisSlug ? `
          <a href="https://www.americanchassisdepot.com/es/product/${contactData.chassisSlug}" 
             style="color: #0A3161;">Ver detalles del producto</a>
        ` : ''}
      </div>
    ` : ''}
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">¿Qué sigue?</h3>
      <ul style="margin-bottom: 0;">
        ${contactData.actionType === 'quote' ? `
          <li>Nuestro equipo de ventas revisará tu solicitud</li>
          <li>Te contactaremos en las próximas 24 horas con una cotización personalizada</li>
          <li>Estamos disponibles para responder cualquier pregunta</li>
        ` : `
          <li>Tu folleto técnico se ha descargado correctamente</li>
          <li>Si tienes preguntas sobre las especificaciones, contáctanos</li>
          <li>Nuestro equipo está listo para ayudarte</li>
        `}
      </ul>
    </div>
    
    <p><strong>¿Necesitas ayuda urgente?</strong></p>
    <p>
      📞 Llámanos: <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a><br>
      ✉️ Email: <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
    </p>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">Thank you for contacting us!</h2>
    
    <p>Hello ${contactData.name},</p>
    
    <p>We have received your ${actionText} and our team is reviewing it.</p>
    
    ${contactData.chassisName ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Product of Interest</h3>
        <p style="margin-bottom: 0; font-weight: bold;">${contactData.chassisName}</p>
        ${contactData.chassisSlug ? `
          <a href="https://www.americanchassisdepot.com/en/product/${contactData.chassisSlug}" 
             style="color: #0A3161;">View product details</a>
        ` : ''}
      </div>
    ` : ''}
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">What's Next?</h3>
      <ul style="margin-bottom: 0;">
        ${contactData.actionType === 'quote' ? `
          <li>Our sales team will review your request</li>
          <li>We'll contact you within 24 hours with a personalized quote</li>
          <li>We're available to answer any questions</li>
        ` : `
          <li>Your technical brochure has been downloaded successfully</li>
          <li>If you have questions about specifications, contact us</li>
          <li>Our team is ready to help</li>
        `}
      </ul>
    </div>
    
    <p><strong>Need urgent assistance?</strong></p>
    <p>
      📞 Call us: <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a><br>
      ✉️ Email: <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
    </p>
  `;

  const subject = isSpanish 
    ? `✅ Confirmación: ${actionText} - American Chassis Depot`
    : `✅ Confirmation: ${actionText} - American Chassis Depot`;

  return sendEmail({
    to: contactData.email,
    subject,
    html: getBaseEmailTemplate(content, language),
  });
}
