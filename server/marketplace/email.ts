import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@americanchassisdepot.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'American Chassis Depot';
const ADMIN_EMAIL = process.env.MARKETPLACE_ADMIN_EMAIL || 'admin@americanchassisdepot.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
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
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error.response?.body || error.message);
    return false;
  }
}

// Email Templates
function getBaseTemplate(content: string, language: 'en' | 'es' = 'en'): string {
  const footer = language === 'es' 
    ? `
      <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        Este email fue enviado por American Chassis Depot Marketplace.<br>
        <a href="https://www.americanchassisdepot.com" style="color: #0A3161;">www.americanchassisdepot.com</a>
      </p>
    `
    : `
      <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        This email was sent by American Chassis Depot Marketplace.<br>
        <a href="https://www.americanchassisdepot.com" style="color: #0A3161;">www.americanchassisdepot.com</a>
      </p>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0A3161 0%, #1a4a8a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">American Chassis Depot</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Marketplace</p>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        ${content}
        ${footer}
      </div>
    </body>
    </html>
  `;
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
  
  // Send to admins
  const adminContent = `
    <h2 style="color: #0A3161; margin-top: 0;">🔔 New Offer Received</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Offer Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Offer #:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${offer.offerNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Listing:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${listing.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${offer.quantity} units</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Price per Unit:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">$${Number(offer.pricePerUnit).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #22c55e; font-weight: bold;">$${totalAmount.toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Buyer Information</h3>
      <p><strong>Name:</strong> ${buyer.firstName || ''} ${buyer.lastName || ''}</p>
      <p><strong>Company:</strong> ${buyer.companyName || 'N/A'}</p>
      <p><strong>Email:</strong> ${buyer.email}</p>
    </div>
    
    ${offer.buyerNotes ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Buyer Notes</h3>
        <p style="margin-bottom: 0;">${offer.buyerNotes}</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/admin/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View in Admin Panel
      </a>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New Offer: ${offer.offerNumber} - $${totalAmount.toLocaleString()}`,
    html: getBaseTemplate(adminContent),
  });
}

// =============================================
// LISTING APPROVAL NOTIFICATIONS
// =============================================

export async function sendListingApprovalNotification(
  listing: any,
  approved: boolean,
  reason?: string
): Promise<boolean> {
  // This would send to the seller, but we need their email
  // For now, just notify admins
  const status = approved ? 'Approved' : 'Rejected';
  
  const content = `
    <h2 style="color: ${approved ? '#22c55e' : '#ef4444'}; margin-top: 0;">
      Listing ${status}: ${listing.listingNumber}
    </h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Listing Details</h3>
      <p><strong>Title:</strong> ${listing.title}</p>
      <p><strong>Type:</strong> ${listing.chassisType} ${listing.chassisSize}</p>
      <p><strong>Location:</strong> ${listing.city}, ${listing.state}</p>
      <p><strong>Price:</strong> $${Number(listing.pricePerUnit).toLocaleString()}</p>
    </div>
    
    ${!approved && reason ? `
      <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #991b1b;">Rejection Reason</h3>
        <p style="margin-bottom: 0;">${reason}</p>
      </div>
    ` : ''}
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Listing ${status}: ${listing.listingNumber} - ${listing.title}`,
    html: getBaseTemplate(content),
  });
}

// =============================================
// USER NOTIFICATIONS
// =============================================

export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: 'en' | 'es' = 'en'
): Promise<boolean> {
  const content = language === 'es' ? `
    <h2 style="color: #0A3161; margin-top: 0;">¡Bienvenido a American Chassis Depot!</h2>
    
    <p>Hola ${name},</p>
    
    <p>Gracias por registrarte en nuestro Marketplace de Chassis. Tu cuenta ha sido creada exitosamente.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">¿Qué puedes hacer ahora?</h3>
      <ul style="margin-bottom: 0;">
        <li>Explorar nuestro inventario de chassis</li>
        <li>Guardar listings en tus favoritos</li>
        <li>Contactar vendedores directamente</li>
        <li>Hacer ofertas en los chassis que te interesen</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/chassis-marketplace" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Explorar Marketplace
      </a>
    </div>
  ` : `
    <h2 style="color: #0A3161; margin-top: 0;">Welcome to American Chassis Depot!</h2>
    
    <p>Hi ${name},</p>
    
    <p>Thank you for registering on our Chassis Marketplace. Your account has been created successfully.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What can you do now?</h3>
      <ul style="margin-bottom: 0;">
        <li>Browse our chassis inventory</li>
        <li>Save listings to your favorites</li>
        <li>Contact sellers directly</li>
        <li>Make offers on chassis you're interested in</li>
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
    ? '¡Bienvenido a American Chassis Depot Marketplace!'
    : 'Welcome to American Chassis Depot Marketplace!';

  return sendEmail({
    to: email,
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

  const statusText = {
    en: { accepted: 'Accepted', rejected: 'Rejected', countered: 'Counter Offer' },
    es: { accepted: 'Aceptada', rejected: 'Rechazada', countered: 'Contra Oferta' },
  };

  const content = language === 'es' ? `
    <h2 style="color: ${statusColors[status]}; margin-top: 0;">
      Tu oferta ha sido ${statusText.es[status]}
    </h2>
    
    <p>Hola ${buyerName},</p>
    
    <p>El vendedor ha respondido a tu oferta en "${listing.titleEs || listing.title}".</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Tu Oferta Original</h3>
      <p><strong>Cantidad:</strong> ${offer.quantity} unidades</p>
      <p><strong>Precio por Unidad:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
    </div>
    
    ${status === 'countered' && counterOffer ? `
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #92400e;">Contra Oferta del Vendedor</h3>
        <p><strong>Cantidad:</strong> ${counterOffer.quantity} unidades</p>
        <p><strong>Precio por Unidad:</strong> $${counterOffer.price.toLocaleString()}</p>
        <p><strong>Total:</strong> $${(counterOffer.quantity * counterOffer.price).toLocaleString()}</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/es/marketplace/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Ver Detalles
      </a>
    </div>
  ` : `
    <h2 style="color: ${statusColors[status]}; margin-top: 0;">
      Your offer has been ${statusText.en[status]}
    </h2>
    
    <p>Hi ${buyerName},</p>
    
    <p>The seller has responded to your offer on "${listing.title}".</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Your Original Offer</h3>
      <p><strong>Quantity:</strong> ${offer.quantity} units</p>
      <p><strong>Price per Unit:</strong> $${Number(offer.pricePerUnit).toLocaleString()}</p>
    </div>
    
    ${status === 'countered' && counterOffer ? `
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #92400e;">Seller's Counter Offer</h3>
        <p><strong>Quantity:</strong> ${counterOffer.quantity} units</p>
        <p><strong>Price per Unit:</strong> $${counterOffer.price.toLocaleString()}</p>
        <p><strong>Total:</strong> $${(counterOffer.quantity * counterOffer.price).toLocaleString()}</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.americanchassisdepot.com/en/marketplace/offers" 
         style="background: #0A3161; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Details
      </a>
    </div>
  `;

  const subject = language === 'es' 
    ? `Tu oferta ha sido ${statusText.es[status]} - ${listing.titleEs || listing.title}`
    : `Your offer has been ${statusText.en[status]} - ${listing.title}`;

  return sendEmail({
    to: buyerEmail,
    subject,
    html: getBaseTemplate(content, language),
  });
}
