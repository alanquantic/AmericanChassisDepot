import sgMail from '@sendgrid/mail';

// =============================================
// SENDGRID CONFIGURATION
// =============================================
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'sales@americanchassisdepot.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'American Chassis Depot';
const NOTIFICATION_EMAILS = [
  'sales@americanchassisdepot.com',
  'alan@ceosnm.com',
  'alan.diaz@alpha-tauro.com',
];

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized for marketplace');
} else {
  console.warn('⚠️ SendGrid API key not configured for marketplace');
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email');
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

function getBaseTemplate(content: string, language: 'en' | 'es' = 'en'): string {
  const footer = language === 'es' 
    ? `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #B22234; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          American Chassis Depot Marketplace<br>
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
          American Chassis Depot Marketplace<br>
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
        <h1 style="color: white; margin: 0; font-size: 24px;">American Chassis Depot</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Chassis Marketplace</p>
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
// USER REGISTRATION & WELCOME EMAILS
// =============================================

export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">¡Bienvenido a American Chassis Depot Marketplace!</h2>
    
    <p>Hola ${name},</p>
    
    <p>Gracias por registrarte en nuestro Marketplace de Chassis. Tu cuenta ha sido creada exitosamente.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">¿Qué puedes hacer ahora?</h3>
      <ul style="margin-bottom: 0;">
        <li>🚛 Explorar nuestro inventario de chassis</li>
        <li>❤️ Guardar listings en tus favoritos</li>
        <li>💬 Contactar vendedores directamente</li>
        <li>💰 Hacer ofertas en los chassis que te interesen</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/chassis-marketplace" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Explorar Marketplace
      </a>
    </div>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">Welcome to American Chassis Depot Marketplace!</h2>
    
    <p>Hi ${name},</p>
    
    <p>Thank you for registering on our Chassis Marketplace. Your account has been created successfully.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What can you do now?</h3>
      <ul style="margin-bottom: 0;">
        <li>🚛 Browse our chassis inventory</li>
        <li>❤️ Save listings to your favorites</li>
        <li>💬 Contact sellers directly</li>
        <li>💰 Make offers on chassis you're interested in</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/chassis-marketplace" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Explore Marketplace
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? '🎉 ¡Bienvenido a American Chassis Depot Marketplace!'
    : '🎉 Welcome to American Chassis Depot Marketplace!';

  // Also notify admin of new registration
  await sendNewUserNotificationToAdmin(email, name, language);

  return sendEmail({
    to: email,
    subject,
    html: getBaseTemplate(content, language),
  });
}

// Notify admin of new user registration
async function sendNewUserNotificationToAdmin(
  userEmail: string,
  userName: string,
  language: 'en' | 'es'
): Promise<boolean> {
  const content = `
    <h2 style="color: #0A3161; margin-top: 0;">👤 New User Registration</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${userEmail}" style="color: #0A3161;">${userEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Language:</td>
          <td style="padding: 10px;">${language === 'es' ? 'Spanish' : 'English'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Registered:</td>
          <td style="padding: 10px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/admin/users" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View in Admin Panel
      </a>
    </div>
  `;

  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `👤 New User: ${userName} (${userEmail})`,
    html: getBaseTemplate(content),
  });
}

// =============================================
// SELLER REGISTRATION
// =============================================

export async function sendSellerApplicationEmail(
  sellerEmail: string,
  sellerName: string,
  companyName: string,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">📝 Solicitud de Vendedor Recibida</h2>
    
    <p>Hola ${sellerName},</p>
    
    <p>Hemos recibido tu solicitud para convertirte en vendedor en American Chassis Depot Marketplace.</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #856404;">⏳ Estado: En Revisión</h3>
      <p style="margin-bottom: 0;">Nuestro equipo revisará tu solicitud y te contactaremos en las próximas 24-48 horas.</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Datos de tu Solicitud</h3>
      <p><strong>Empresa:</strong> ${companyName}</p>
      <p><strong>Email:</strong> ${sellerEmail}</p>
    </div>
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">📝 Seller Application Received</h2>
    
    <p>Hi ${sellerName},</p>
    
    <p>We have received your application to become a seller on American Chassis Depot Marketplace.</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #856404;">⏳ Status: Under Review</h3>
      <p style="margin-bottom: 0;">Our team will review your application and contact you within 24-48 hours.</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Your Application Details</h3>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Email:</strong> ${sellerEmail}</p>
    </div>
    
    <p>If you have any questions, don't hesitate to contact us.</p>
  `;

  const subject = language === 'es' 
    ? '📝 Solicitud de Vendedor Recibida - American Chassis Depot'
    : '📝 Seller Application Received - American Chassis Depot';

  // Notify admin of new seller application
  await sendSellerApplicationNotificationToAdmin(sellerEmail, sellerName, companyName);

  return sendEmail({
    to: sellerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

async function sendSellerApplicationNotificationToAdmin(
  sellerEmail: string,
  sellerName: string,
  companyName: string
): Promise<boolean> {
  const content = `
    <h2 style="color: #f59e0b; margin-top: 0;">🏪 New Seller Application</h2>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Action Required: Review this seller application</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Applicant Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${sellerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${companyName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${sellerEmail}" style="color: #0A3161;">${sellerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Applied:</td>
          <td style="padding: 10px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/admin/sellers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Review Application
      </a>
    </div>
  `;

  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `🏪 New Seller Application: ${companyName} (${sellerName})`,
    html: getBaseTemplate(content),
  });
}

export async function sendSellerApprovalEmail(
  sellerEmail: string,
  sellerName: string,
  approved: boolean,
  reason?: string,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const statusColor = approved ? '#22c55e' : '#ef4444';
  const statusIcon = approved ? '✅' : '❌';

  const content = language === 'es' ? `
    <h2 style="color: ${statusColor}; margin-top: 0;">${statusIcon} Solicitud de Vendedor ${approved ? 'Aprobada' : 'Rechazada'}</h2>
    
    <p>Hola ${sellerName},</p>
    
    ${approved ? `
      <p>¡Felicidades! Tu solicitud para convertirte en vendedor ha sido aprobada.</p>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">🎉 Próximos Pasos</h3>
        <ul style="margin-bottom: 0;">
          <li>Inicia sesión en tu cuenta</li>
          <li>Completa tu perfil de vendedor</li>
          <li>Comienza a publicar tus chassis</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://www.americanchassisdepot.com/es/marketplace/seller/dashboard" 
           style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Ir a mi Dashboard
        </a>
      </div>
    ` : `
      <p>Lamentablemente, tu solicitud de vendedor no ha sido aprobada en este momento.</p>
      
      ${reason ? `
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Motivo</h3>
          <p style="margin-bottom: 0;">${reason}</p>
        </div>
      ` : ''}
      
      <p>Si crees que esto es un error o tienes preguntas, contáctanos.</p>
    `}
  ` : `
    <h2 style="color: ${statusColor}; margin-top: 0;">${statusIcon} Seller Application ${approved ? 'Approved' : 'Rejected'}</h2>
    
    <p>Hi ${sellerName},</p>
    
    ${approved ? `
      <p>Congratulations! Your application to become a seller has been approved.</p>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">🎉 Next Steps</h3>
        <ul style="margin-bottom: 0;">
          <li>Log in to your account</li>
          <li>Complete your seller profile</li>
          <li>Start listing your chassis</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://www.americanchassisdepot.com/en/marketplace/seller/dashboard" 
           style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to My Dashboard
        </a>
      </div>
    ` : `
      <p>Unfortunately, your seller application has not been approved at this time.</p>
      
      ${reason ? `
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Reason</h3>
          <p style="margin-bottom: 0;">${reason}</p>
        </div>
      ` : ''}
      
      <p>If you believe this is an error or have questions, please contact us.</p>
    `}
  `;

  const subject = language === 'es' 
    ? `${statusIcon} Tu solicitud de vendedor ha sido ${approved ? 'aprobada' : 'rechazada'}`
    : `${statusIcon} Your seller application has been ${approved ? 'approved' : 'rejected'}`;

  return sendEmail({
    to: sellerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

// =============================================
// OFFER NOTIFICATIONS
// =============================================

export async function sendOfferNotification(
  offer: any,
  listing: any,
  buyer: any
): Promise<boolean> {
  const totalAmount = offer.quantity * Number(offer.pricePerUnit);
  
  // Send to admins (and seller which is currently American Chassis Depot)
  const adminContent = `
    <h2 style="color: #0A3161; margin-top: 0;">🔔 New Offer Received</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Offer Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Offer #:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${offer.offerNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Listing:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.title}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Quantity:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${offer.quantity} units</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Price per Unit:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${Number(offer.pricePerUnit).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Total Amount:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #22c55e; font-weight: bold; font-size: 18px;">
            $${totalAmount.toLocaleString()}
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Buyer Information</h3>
      <p><strong>Name:</strong> ${buyer.firstName || ''} ${buyer.lastName || ''}</p>
      <p><strong>Company:</strong> ${buyer.companyName || 'N/A'}</p>
      <p><strong>Email:</strong> <a href="mailto:${buyer.email}" style="color: #0A3161;">${buyer.email}</a></p>
      ${buyer.phone ? `<p><strong>Phone:</strong> <a href="tel:${buyer.phone}" style="color: #0A3161;">${buyer.phone}</a></p>` : ''}
    </div>
    
    ${offer.buyerNotes ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Buyer Notes</h3>
        <p style="margin-bottom: 0;">${offer.buyerNotes}</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/admin/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
        View in Admin Panel
      </a>
      <a href="mailto:${buyer.email}?subject=Re: Offer ${offer.offerNumber} for ${listing.title}" 
         style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Reply to Buyer
      </a>
    </div>
  `;

  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `🔔 New Offer: ${offer.offerNumber} - $${totalAmount.toLocaleString()} for ${listing.title}`,
    html: getBaseTemplate(adminContent),
    replyTo: buyer.email,
  });
}

// Notify buyer when their offer is received
export async function sendOfferConfirmationToBuyer(
  buyerEmail: string,
  buyerName: string,
  offer: any,
  listing: any,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const totalAmount = offer.quantity * Number(offer.pricePerUnit);

  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">✅ Tu Oferta ha sido Enviada</h2>
    
    <p>Hola ${buyerName},</p>
    
    <p>Tu oferta ha sido enviada exitosamente al vendedor.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Detalles de tu Oferta</h3>
      <p><strong>Número de Oferta:</strong> ${offer.offerNumber}</p>
      <p><strong>Listing:</strong> ${listing.titleEs || listing.title}</p>
      <p><strong>Cantidad:</strong> ${offer.quantity} unidades</p>
      <p><strong>Precio por Unidad:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${totalAmount.toLocaleString()}</span></p>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;"><strong>⏳ ¿Qué sigue?</strong><br>
      El vendedor revisará tu oferta y te contactará pronto. Normalmente respondemos en 24-48 horas.</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/dashboard" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Ver mis Ofertas
      </a>
    </div>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">✅ Your Offer has been Submitted</h2>
    
    <p>Hi ${buyerName},</p>
    
    <p>Your offer has been successfully submitted to the seller.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Your Offer Details</h3>
      <p><strong>Offer Number:</strong> ${offer.offerNumber}</p>
      <p><strong>Listing:</strong> ${listing.title}</p>
      <p><strong>Quantity:</strong> ${offer.quantity} units</p>
      <p><strong>Price per Unit:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${totalAmount.toLocaleString()}</span></p>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;"><strong>⏳ What's Next?</strong><br>
      The seller will review your offer and contact you soon. We typically respond within 24-48 hours.</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/dashboard" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View My Offers
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `✅ Oferta Enviada: ${offer.offerNumber} - ${listing.titleEs || listing.title}`
    : `✅ Offer Submitted: ${offer.offerNumber} - ${listing.title}`;

  return sendEmail({
    to: buyerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

export async function sendOfferReceivedEmail(
  sellerEmail: string,
  sellerName: string,
  offer: any,
  listing: any,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const totalAmount = offer.quantity * Number(offer.pricePerUnit);
  
  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">📬 Nueva Oferta Recibida</h2>
    
    <p>Hola ${sellerName},</p>
    
    <p>Has recibido una nueva oferta en tu listing.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Detalles de la Oferta</h3>
      <p><strong>Listing:</strong> ${listing.titleEs || listing.title}</p>
      <p><strong>Cantidad:</strong> ${offer.quantity} unidades</p>
      <p><strong>Precio por Unidad:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${totalAmount.toLocaleString()}</span></p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/seller/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Ver Oferta
      </a>
    </div>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">📬 New Offer Received</h2>
    
    <p>Hi ${sellerName},</p>
    
    <p>You have received a new offer on your listing.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Offer Details</h3>
      <p><strong>Listing:</strong> ${listing.title}</p>
      <p><strong>Quantity:</strong> ${offer.quantity} units</p>
      <p><strong>Price per Unit:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${totalAmount.toLocaleString()}</span></p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/seller/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Offer
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `📬 Nueva Oferta: $${totalAmount.toLocaleString()} - ${listing.titleEs || listing.title}`
    : `📬 New Offer: $${totalAmount.toLocaleString()} - ${listing.title}`;

  return sendEmail({
    to: sellerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

export async function sendOfferResponseEmail(
  buyerEmail: string,
  buyerName: string,
  offer: any,
  listing: any,
  status: 'accepted' | 'rejected' | 'countered',
  counterOffer?: { price: number; quantity: number },
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const statusColors = {
    accepted: '#22c55e',
    rejected: '#ef4444',
    countered: '#f59e0b',
  };

  const statusIcons = {
    accepted: '✅',
    rejected: '❌',
    countered: '💬',
  };

  const statusText = {
    en: { accepted: 'Accepted', rejected: 'Rejected', countered: 'Counter Offer Received' },
    es: { accepted: 'Aceptada', rejected: 'Rechazada', countered: 'Contra Oferta Recibida' },
  };

  const content = language === 'es' ? `
    <h2 style="color: ${statusColors[status]}; margin-top: 0;">
      ${statusIcons[status]} Tu oferta ha sido ${statusText.es[status]}
    </h2>
    
    <p>Hola ${buyerName},</p>
    
    <p>El vendedor ha respondido a tu oferta en "${listing.titleEs || listing.title}".</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Tu Oferta Original</h3>
      <p><strong>Cantidad:</strong> ${offer.quantity} unidades</p>
      <p><strong>Precio por Unidad:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> $${(offer.quantity * Number(offer.pricePerUnit)).toLocaleString()}</p>
    </div>
    
    ${status === 'countered' && counterOffer ? `
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #92400e;">💬 Contra Oferta del Vendedor</h3>
        <p><strong>Cantidad:</strong> ${counterOffer.quantity} unidades</p>
        <p><strong>Precio por Unidad:</strong> $${counterOffer.price.toLocaleString()}</p>
        <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${(counterOffer.quantity * counterOffer.price).toLocaleString()}</span></p>
      </div>
    ` : ''}
    
    ${status === 'accepted' ? `
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">🎉 ¡Felicidades!</h3>
        <p style="margin-bottom: 0;">Tu oferta ha sido aceptada. Nos pondremos en contacto contigo para coordinar el pago y la entrega.</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/dashboard" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Ver Detalles
      </a>
    </div>
  ` : `
    <h2 style="color: ${statusColors[status]}; margin-top: 0;">
      ${statusIcons[status]} Your offer has been ${statusText.en[status]}
    </h2>
    
    <p>Hi ${buyerName},</p>
    
    <p>The seller has responded to your offer on "${listing.title}".</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Your Original Offer</h3>
      <p><strong>Quantity:</strong> ${offer.quantity} units</p>
      <p><strong>Price per Unit:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
      <p><strong>Total:</strong> $${(offer.quantity * Number(offer.pricePerUnit)).toLocaleString()}</p>
    </div>
    
    ${status === 'countered' && counterOffer ? `
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #92400e;">💬 Seller's Counter Offer</h3>
        <p><strong>Quantity:</strong> ${counterOffer.quantity} units</p>
        <p><strong>Price per Unit:</strong> $${counterOffer.price.toLocaleString()}</p>
        <p><strong>Total:</strong> <span style="color: #22c55e; font-weight: bold;">$${(counterOffer.quantity * counterOffer.price).toLocaleString()}</span></p>
      </div>
    ` : ''}
    
    ${status === 'accepted' ? `
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">🎉 Congratulations!</h3>
        <p style="margin-bottom: 0;">Your offer has been accepted. We will contact you to coordinate payment and delivery.</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/dashboard" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Details
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `${statusIcons[status]} Tu oferta ha sido ${statusText.es[status]} - ${listing.titleEs || listing.title}`
    : `${statusIcons[status]} Your offer has been ${statusText.en[status]} - ${listing.title}`;

  return sendEmail({
    to: buyerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

// =============================================
// LISTING NOTIFICATIONS
// =============================================

export async function sendListingApprovalNotification(
  listing: any,
  approved: boolean,
  reason?: string
): Promise<boolean> {
  const status = approved ? 'Approved' : 'Rejected';
  const statusColor = approved ? '#22c55e' : '#ef4444';
  const statusIcon = approved ? '✅' : '❌';
  
  const content = `
    <h2 style="color: ${statusColor}; margin-top: 0;">
      ${statusIcon} Listing ${status}: ${listing.listingNumber}
    </h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Listing Details</h3>
      <p><strong>Title:</strong> ${listing.title}</p>
      <p><strong>Type:</strong> ${listing.chassisType} ${listing.chassisSize}</p>
      <p><strong>Location:</strong> ${listing.city}, ${listing.state}</p>
      <p><strong>Price:</strong> $${Number(listing.pricePerUnit).toLocaleString()}</p>
      <p><strong>Quantity:</strong> ${listing.quantityAvailable} units</p>
    </div>
    
    ${!approved && reason ? `
      <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #991b1b;">Rejection Reason</h3>
        <p style="margin-bottom: 0;">${reason}</p>
      </div>
    ` : ''}
    
    ${approved ? `
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://www.americanchassisdepot.com/en/chassis-marketplace/${listing.slug}" 
           style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Live Listing
        </a>
      </div>
    ` : ''}
  `;

  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `${statusIcon} Listing ${status}: ${listing.listingNumber} - ${listing.title}`,
    html: getBaseTemplate(content),
  });
}

// Notify when new listing is created
export async function sendNewListingNotificationToAdmin(
  listing: any
): Promise<boolean> {
  const content = `
    <h2 style="color: #0A3161; margin-top: 0;">📋 New Listing Created</h2>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Action Required: Review and approve this listing</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Listing Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Listing #:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.listingNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Title:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.title}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Type:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.chassisType} ${listing.chassisSize}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Condition:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.condition}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Location:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${listing.city}, ${listing.state}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Price:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${Number(listing.pricePerUnit).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Quantity:</td>
          <td style="padding: 10px;">${listing.quantityAvailable} units</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/admin/listings/pending" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Review Listing
      </a>
    </div>
  `;

  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `📋 New Listing: ${listing.listingNumber} - ${listing.title} ($${Number(listing.pricePerUnit).toLocaleString()})`,
    html: getBaseTemplate(content),
  });
}

// =============================================
// MESSAGE NOTIFICATIONS
// =============================================

export async function sendMessageNotification(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  senderEmail: string,
  messagePreview: string,
  listing: any,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">💬 Nuevo Mensaje Recibido</h2>
    
    <p>Hola ${recipientName},</p>
    
    <p>Has recibido un nuevo mensaje de <strong>${senderName}</strong> sobre tu listing.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Listing</h3>
      <p style="margin-bottom: 0;">${listing.titleEs || listing.title}</p>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Mensaje</h3>
      <p style="margin-bottom: 0; font-style: italic;">"${messagePreview}"</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/messages" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Responder Mensaje
      </a>
    </div>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">💬 New Message Received</h2>
    
    <p>Hi ${recipientName},</p>
    
    <p>You have received a new message from <strong>${senderName}</strong> about your listing.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Listing</h3>
      <p style="margin-bottom: 0;">${listing.title}</p>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Message</h3>
      <p style="margin-bottom: 0; font-style: italic;">"${messagePreview}"</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/messages" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Reply to Message
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `💬 Nuevo mensaje de ${senderName} - ${listing.titleEs || listing.title}`
    : `💬 New message from ${senderName} - ${listing.title}`;

  // Also notify admin
  await sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `💬 New Message: ${senderName} → ${recipientName} re: ${listing.title}`,
    html: getBaseTemplate(`
      <h2 style="color: #0A3161; margin-top: 0;">💬 New Message in Marketplace</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>From:</strong> ${senderName} (<a href="mailto:${senderEmail}">${senderEmail}</a>)</p>
        <p><strong>To:</strong> ${recipientName} (<a href="mailto:${recipientEmail}">${recipientEmail}</a>)</p>
        <p><strong>Listing:</strong> ${listing.title}</p>
      </div>
      
      <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Message</h3>
        <p style="margin-bottom: 0;">"${messagePreview}"</p>
      </div>
    `),
  });

  return sendEmail({
    to: recipientEmail,
    subject,
    html: getBaseTemplate(content, language),
    replyTo: senderEmail,
  });
}

// =============================================
// ORDER/PAYMENT NOTIFICATIONS
// =============================================

export async function sendOrderConfirmationEmail(
  buyerEmail: string,
  buyerName: string,
  order: any,
  listing: any,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const content = language === 'es' ? `
    <h2 style="color: #22c55e; margin-top: 0;">🎉 ¡Pedido Confirmado!</h2>
    
    <p>Hola ${buyerName},</p>
    
    <p>Tu pedido ha sido confirmado. Gracias por tu compra.</p>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">Detalles del Pedido</h3>
      <p><strong>Número de Pedido:</strong> ${order.orderNumber}</p>
      <p><strong>Producto:</strong> ${listing.titleEs || listing.title}</p>
      <p><strong>Cantidad:</strong> ${order.quantity} unidades</p>
      <p><strong>Total:</strong> <span style="font-size: 20px; font-weight: bold;">$${Number(order.totalAmount).toLocaleString()}</span></p>
    </div>
    
    <p>Nos pondremos en contacto contigo pronto para coordinar la entrega.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/orders/${order.id}" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Ver mi Pedido
      </a>
    </div>
  ` : `
    <h2 style="color: #22c55e; margin-top: 0;">🎉 Order Confirmed!</h2>
    
    <p>Hi ${buyerName},</p>
    
    <p>Your order has been confirmed. Thank you for your purchase.</p>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">Order Details</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Product:</strong> ${listing.title}</p>
      <p><strong>Quantity:</strong> ${order.quantity} units</p>
      <p><strong>Total:</strong> <span style="font-size: 20px; font-weight: bold;">$${Number(order.totalAmount).toLocaleString()}</span></p>
    </div>
    
    <p>We will contact you soon to coordinate delivery.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/orders/${order.id}" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View My Order
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `🎉 Pedido Confirmado: ${order.orderNumber} - $${Number(order.totalAmount).toLocaleString()}`
    : `🎉 Order Confirmed: ${order.orderNumber} - $${Number(order.totalAmount).toLocaleString()}`;

  // Notify admin of new order
  await sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `💰 New Order: ${order.orderNumber} - $${Number(order.totalAmount).toLocaleString()}`,
    html: getBaseTemplate(`
      <h2 style="color: #22c55e; margin-top: 0;">💰 New Order Received!</h2>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">Order Details</h3>
        <p><strong>Order #:</strong> ${order.orderNumber}</p>
        <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>Listing:</strong> ${listing.title}</p>
        <p><strong>Quantity:</strong> ${order.quantity} units</p>
        <p><strong>Total:</strong> <span style="font-size: 24px; font-weight: bold; color: #22c55e;">$${Number(order.totalAmount).toLocaleString()}</span></p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://www.americanchassisdepot.com/en/marketplace/admin/orders" 
           style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View in Admin Panel
        </a>
      </div>
    `),
  });

  return sendEmail({
    to: buyerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}

// =============================================
// LISTING INQUIRY (NO AUTH REQUIRED)
// =============================================

export async function sendListingInquiryEmail(
  inquiryData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
  },
  listing: any,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const adminContent = `
    <h2 style="color: #0A3161; margin-top: 0;">🚛 New Marketplace Inquiry</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiryData.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${inquiryData.email}" style="color: #0A3161;">${inquiryData.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${inquiryData.phone ? `<a href="tel:${inquiryData.phone}" style="color: #0A3161;">${inquiryData.phone}</a>` : 'Not provided'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiryData.company || 'Not provided'}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Listing of Interest</h3>
      <p><strong>${listing.listingNumber}</strong> - ${listing.title}</p>
      <p><strong>Type:</strong> ${listing.chassisType} ${listing.chassisSize}</p>
      <p><strong>Condition:</strong> ${listing.condition}</p>
      <p><strong>Location:</strong> ${listing.city}, ${listing.state}</p>
      <p><strong>Price:</strong> $${Number(listing.pricePerUnit).toLocaleString()} per unit</p>
      <p><strong>Available:</strong> ${listing.quantityAvailable} units</p>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Message</h3>
      <p style="white-space: pre-line; margin-bottom: 0;">${inquiryData.message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:${inquiryData.email}?subject=Re: ${listing.title} - American Chassis Depot Marketplace" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
        Reply to Customer
      </a>
      <a href="https://www.americanchassisdepot.com/en/chassis-marketplace/${listing.slug}" 
         style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Listing
      </a>
    </div>
  `;

  const isSpanish = language === 'es';
  const confirmationContent = isSpanish ? `
    <h2 style="color: #0A3161; margin-top: 0;">¡Gracias por contactarnos!</h2>
    
    <p>Hola ${inquiryData.name},</p>
    
    <p>Hemos recibido tu consulta sobre el siguiente listing en nuestro Marketplace:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold;">${listing.title}</p>
      <p style="margin: 5px 0 0 0; color: #666;">${listing.chassisType} ${listing.chassisSize} - ${listing.condition}</p>
      <p style="margin: 5px 0 0 0; color: #0A3161; font-weight: bold;">$${Number(listing.pricePerUnit).toLocaleString()} por unidad</p>
    </div>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">¿Qué sigue?</h3>
      <ul style="margin-bottom: 0;">
        <li>Nuestro equipo revisará tu consulta</li>
        <li>Te contactaremos en las próximas 24 horas</li>
        <li>Estamos disponibles para responder cualquier pregunta</li>
      </ul>
    </div>
    
    <p><strong>¿Necesitas ayuda urgente?</strong></p>
    <p>
      📞 Llámanos: <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a><br>
      ✉️ Email: <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
    </p>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">Thank you for contacting us!</h2>
    
    <p>Hello ${inquiryData.name},</p>
    
    <p>We have received your inquiry about the following listing on our Marketplace:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold;">${listing.title}</p>
      <p style="margin: 5px 0 0 0; color: #666;">${listing.chassisType} ${listing.chassisSize} - ${listing.condition}</p>
      <p style="margin: 5px 0 0 0; color: #0A3161; font-weight: bold;">$${Number(listing.pricePerUnit).toLocaleString()} per unit</p>
    </div>
    
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #155724;">What's Next?</h3>
      <ul style="margin-bottom: 0;">
        <li>Our team will review your inquiry</li>
        <li>We'll contact you within 24 hours</li>
        <li>We're available to answer any questions</li>
      </ul>
    </div>
    
    <p><strong>Need urgent assistance?</strong></p>
    <p>
      📞 Call us: <a href="tel:+14422579946" style="color: #0A3161;">+1 (442) 257-9946</a><br>
      ✉️ Email: <a href="mailto:sales@americanchassisdepot.com" style="color: #0A3161;">sales@americanchassisdepot.com</a>
    </p>
  `;

  const confirmSubject = isSpanish
    ? `✅ Confirmación: Tu consulta sobre ${listing.title} - American Chassis Depot`
    : `✅ Confirmation: Your inquiry about ${listing.title} - American Chassis Depot`;

  // Send confirmation to the inquirer (non-blocking)
  sendEmail({
    to: inquiryData.email,
    subject: confirmSubject,
    html: getBaseTemplate(confirmationContent, language),
  }).catch(e => console.error('Error sending inquiry confirmation:', e));

  // Send notification to all admins
  return sendEmail({
    to: NOTIFICATION_EMAILS,
    subject: `🚛 Marketplace Inquiry: ${inquiryData.name} - ${listing.title}`,
    html: getBaseTemplate(adminContent),
    replyTo: inquiryData.email,
  });
}

// =============================================
// PASSWORD RESET
// =============================================

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const resetUrl = `https://www.americanchassisdepot.com/${language}/marketplace/reset-password?token=${resetToken}`;

  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">🔐 Restablecer Contraseña</h2>
    
    <p>Hola ${name},</p>
    
    <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: #0A3161; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
        Restablecer Contraseña
      </a>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">
        ⚠️ Este enlace expirará en 1 hora.<br>
        Si no solicitaste este cambio, ignora este correo.
      </p>
    </div>
    
    <p style="color: #666; font-size: 12px;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${resetUrl}" style="color: #0A3161; word-break: break-all;">${resetUrl}</a>
    </p>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">🔐 Reset Your Password</h2>
    
    <p>Hi ${name},</p>
    
    <p>We received a request to reset your password. Click the button below to create a new password.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: #0A3161; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">
        ⚠️ This link will expire in 1 hour.<br>
        If you didn't request this change, please ignore this email.
      </p>
    </div>
    
    <p style="color: #666; font-size: 12px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #0A3161; word-break: break-all;">${resetUrl}</a>
    </p>
  `;

  const subject = language === 'es' 
    ? '🔐 Restablecer tu Contraseña - American Chassis Depot'
    : '🔐 Reset Your Password - American Chassis Depot';

  return sendEmail({
    to: email,
    subject,
    html: getBaseTemplate(content, language),
  });
}
