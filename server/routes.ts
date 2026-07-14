import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage.js";
import { insertContactMessageSchema } from "../shared/schema.js";
import { ZodError } from "zod";
import { sendContactNotification, sendCustomerConfirmationEmail } from "./services/mail.js";
import { processFormSubmission, testOdooConnection, getOdooLeadStats } from "./services/odoo.js";
import marketplaceRoutes from "./marketplace/routes.js";
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from "./marketplace/auth.js";
import { createCrmLead, getListingBySlug } from "./marketplace/storage.js";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = "/api";

  // Register marketplace routes
  app.use(`${apiPrefix}/marketplace`, marketplaceRoutes);

  // Get all conditions (new/used)
  app.get(`${apiPrefix}/conditions`, async (_req, res) => {
    try {
      const conditions = await storage.getAllConditions();
      return res.json(conditions);
    } catch (error) {
      console.error("Error fetching conditions:", error);
      return res.status(500).json({ message: "Failed to fetch conditions" });
    }
  });

  // Get condition by slug
  app.get(`${apiPrefix}/conditions/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const condition = await storage.getConditionBySlug(slug);
      
      if (!condition) {
        return res.status(404).json({ message: "Condition not found" });
      }
      
      return res.json(condition);
    } catch (error) {
      console.error("Error fetching condition:", error);
      return res.status(500).json({ message: "Failed to fetch condition" });
    }
  });

  // Get all chassis models
  app.get(`${apiPrefix}/chassis`, async (_req, res) => {
    try {
      const models = await storage.getAllChassisModels();
      return res.json(models);
    } catch (error) {
      console.error("Error fetching chassis models:", error);
      return res.status(500).json({ message: "Failed to fetch chassis models" });
    }
  });

  const SITE_BASE = 'https://www.americanchassisdepot.com';

  // Sitemap index: references corporate + marketplace sitemaps
  app.get('/sitemap-index.xml', (_req: Request, res: Response) => {
    const now = new Date().toISOString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/api/marketplace/sitemap-marketplace.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  });

  // Corporate sitemap with full bilingual support and hreflang
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const models = await storage.getAllChassisModels();
      const lastmod = new Date().toISOString().slice(0, 10);

      const staticPages = [
        { path: '', changefreq: 'weekly', priority: '1.0' },
        { path: '/products', changefreq: 'weekly', priority: '0.8' },
        { path: '/new-chassis', changefreq: 'weekly', priority: '0.8' },
        { path: '/used-chassis', changefreq: 'weekly', priority: '0.8' },
        { path: '/about', changefreq: 'monthly', priority: '0.6' },
        { path: '/contact', changefreq: 'monthly', priority: '0.6' },
      ];

      let urls = '';
      for (const page of staticPages) {
        const enUrl = `${SITE_BASE}/en${page.path}`;
        const esUrl = `${SITE_BASE}/es${page.path}`;
        urls += `  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  <url>
    <loc>${esUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${String(Math.max(0.5, Number(page.priority) - 0.1))}</priority>
  </url>\n`;
      }

      for (const m of models) {
        const enSlug = m.slug.endsWith('-esp') ? m.slug.slice(0, -4) : m.slug;
        const esSlug = m.slug.endsWith('-esp') ? m.slug : `${m.slug}-esp`;
        const enUrl = `${SITE_BASE}/en/products/${enSlug}`;
        const esUrl = `${SITE_BASE}/es/products/${esSlug}`;
        urls += `  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${esUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`;
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(xml);
    } catch (e) {
      console.error('Error generating sitemap:', e);
      return res.status(500).send('');
    }
  });
  
  // Filter chassis models
  app.get(`${apiPrefix}/chassis/filter`, async (req, res) => {
    try {
      // Extract condition value from query parameters
      let conditionSlug = req.query.condition as string | undefined;
      if (conditionSlug && conditionSlug !== 'all') {
        // Extract the slug from the value (e.g., 'new-chassis' -> 'new-chassis')
        conditionSlug = conditionSlug.toString();
      } else {
        conditionSlug = undefined;
      }
      
      // Extract size from query parameters
      const size = req.query.size !== 'all' ? req.query.size as string : undefined;
      
      // Extract manufacturer from query parameters
      let manufacturer = req.query.manufacturer as string | undefined;
      if (manufacturer && manufacturer !== 'all') {
        // If it's a manufacturer format, extract the actual name
        if (manufacturer.startsWith('manufacturer-')) {
          manufacturer = manufacturer.split('-')[1];
        }
      } else {
        manufacturer = undefined;
      }
      
      // Extract characteristic from query parameters
      const characteristic = req.query.characteristic !== 'all' ? req.query.characteristic as string : undefined;
      
      // Debug logging removed - filters working correctly
      
      try {
        const models = await storage.filterChassisModels(conditionSlug, size, manufacturer, characteristic);
        // Debug logging removed - filters working correctly
        
        // Asegurarnos de que models es un array antes de devolverlo
        if (Array.isArray(models)) {
          return res.json(models);
        } else {
          console.error("Unexpected response format from filterChassisModels:", models);
          return res.json([]); // Devolver un array vacío en caso de respuesta inesperada
        }
      } catch (filterError) {
        console.error("Error in filterChassisModels operation:", filterError);
        return res.json([]); // Devolver un array vacío en caso de error
      }
    } catch (error) {
      console.error("Error filtering chassis models:", error);
      return res.status(500).json({ message: "Failed to filter chassis models" });
    }
  });

  // Get chassis models by condition
  app.get(`${apiPrefix}/conditions/:slug/chassis`, async (req, res) => {
    try {
      const { slug } = req.params;
      const condition = await storage.getConditionBySlug(slug);
      
      if (!condition) {
        return res.status(404).json({ message: "Condition not found" });
      }
      
      const models = await storage.getChassisModelsByCondition(condition.id);
      return res.json(models);
    } catch (error) {
      console.error("Error fetching chassis models:", error);
      return res.status(500).json({ message: "Failed to fetch chassis models" });
    }
  });

  // Get chassis model by slug
  app.get(`${apiPrefix}/chassis/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const model = await storage.getChassisModelBySlug(slug);
      
      if (!model) {
        return res.status(404).json({ message: "Chassis model not found" });
      }
      
      return res.json(model);
    } catch (error) {
      console.error("Error fetching chassis model:", error);
      return res.status(500).json({ message: "Failed to fetch chassis model" });
    }
  });

  // Download brochure endpoint
  app.post(`${apiPrefix}/download-brochure`, async (req, res) => {
    try {
      const { 
        name, 
        email, 
        company, 
        phone, 
        units,
        interest,
        message,
        chassisName, 
        chassisSlug,
        actionType,
        sourceUrl,
        userAgent,
        timestamp,
        honeypot 
      } = req.body;

      // Security check: honeypot field should be empty
      if (honeypot) {
        console.warn("Bot detected via honeypot field");
        return res.status(400).json({ message: "Invalid submission" });
      }

      // Security check: timestamp validation
      const submissionTime = new Date(timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - submissionTime.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeDiff > fiveMinutes) {
        return res.status(400).json({ message: "Form submission expired" });
      }
      
      const messageContent = message || `Brochure Request: ${chassisName} (${chassisSlug}) - User requested brochure for chassis`;
      const contactData = {
        name,
        email,
        company: company || null,
        phone: phone || null,
        units: units || null,
        interest: interest || null,
        message: messageContent,
        sourceUrl: sourceUrl || null,
        createdAt: new Date().toISOString()
      };

      // Try to save to database (non-blocking if DB is unavailable)
      let contactMessage: any = { ...contactData, id: 0 };
      try {
        contactMessage = await storage.createContactMessage(contactData);
      } catch (dbError) {
        console.warn('DB save failed for brochure request, continuing with email:', dbError);
      }

      try {
        await createCrmLead({
          source: 'corporate_brochure',
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: messageContent,
          metadata: { chassisName, chassisSlug, actionType: 'brochure', sourceUrl },
        });
      } catch (crmErr) {
        console.warn('CRM lead creation failed (non-blocking):', crmErr);
      }

      // Send customer confirmation email
      let customerEmailSent = false;
      try {
        const language = sourceUrl?.includes('/es/') ? 'es' : 'en';
        customerEmailSent = await sendCustomerConfirmationEmail({
          name,
          email,
          company: company || '',
          phone: phone || '',
          units: units || '',
          interest: interest || '',
          message: message || '',
          chassisName,
          chassisSlug,
          actionType: 'brochure'
        }, language);
        
        if (customerEmailSent) {
          console.log('Customer confirmation email sent successfully');
        } else {
          console.warn('Customer confirmation email was not sent');
        }
      } catch (emailError) {
        console.error('Failed to send customer confirmation email:', emailError);
      }

      // Send internal notification
      let internalEmailSent = false;
      try {
        internalEmailSent = await sendContactNotification(contactMessage, sourceUrl || 'Unknown source');
        if (internalEmailSent) {
          console.log('Internal notification email sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send internal notification email:', emailError);
      }

      return res.status(200).json({
        message: "Brochure request processed successfully",
        customerEmailSent,
        internalEmailSent,
        data: contactMessage
      });
      
    } catch (error) {
      console.error("Error processing brochure download:", error);
      return res.status(500).json({ message: "Failed to process brochure download" });
    }
  });

  // Submit contact form
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const { 
        name, 
        email, 
        company, 
        phone, 
        units,
        interest,
        message,
        chassisName,
        chassisSlug,
        actionType,
        sourceUrl,
        userAgent,
        timestamp,
        honeypot 
      } = req.body;

      // Security check: honeypot field should be empty
      if (honeypot) {
        console.warn("Bot detected via honeypot field");
        return res.status(400).json({ message: "Invalid submission" });
      }

      // Security check: timestamp validation
      const submissionTime = new Date(timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - submissionTime.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeDiff > fiveMinutes) {
        return res.status(400).json({ message: "Form submission expired" });
      }

      const messageContent = message || `Quote Request: ${chassisName} (${chassisSlug}) - User requested quote for chassis`;
      const messageData = {
        name,
        email,
        company: company || null,
        phone: phone || null,
        units: units || null,
        interest: interest || null,
        message: messageContent,
        sourceUrl: sourceUrl || null,
        createdAt: new Date().toISOString(),
      };
      
      // Validate the request body
      const validatedData = insertContactMessageSchema.parse(messageData);
      
      // Try to save to database (non-blocking if DB is unavailable)
      let newMessage: any = { ...validatedData, id: 0 };
      try {
        newMessage = await storage.createContactMessage(validatedData);
      } catch (dbError) {
        console.warn('DB save failed for contact form, continuing with email:', dbError);
      }

      try {
        await createCrmLead({
          source: 'corporate_contact',
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: messageContent,
          metadata: { chassisName, chassisSlug, actionType: actionType || 'quote', sourceUrl, units, interest },
        });
      } catch (crmErr) {
        console.warn('CRM lead creation failed (non-blocking):', crmErr);
      }

      // Send customer confirmation email
      let customerEmailSent = false;
      try {
        const language = sourceUrl?.includes('/es/') ? 'es' : 'en';
        customerEmailSent = await sendCustomerConfirmationEmail({
          name,
          email,
          company: company || '',
          phone: phone || '',
          units: units || '',
          interest: interest || '',
          message: message || '',
          chassisName,
          chassisSlug,
          actionType: 'quote'
        }, language);
        
        if (customerEmailSent) {
          console.log('Customer confirmation email sent successfully');
        } else {
          console.warn('Customer confirmation email was not sent');
        }
      } catch (emailError) {
        console.error('Failed to send customer confirmation email:', emailError);
      }

      // Send internal notification
      let internalEmailSent = false;
      try {
        internalEmailSent = await sendContactNotification(newMessage, sourceUrl || 'Unknown source');
        if (internalEmailSent) {
          console.log('Internal notification email sent successfully');
        } else {
          console.warn('Internal notification email was not sent');
        }
      } catch (emailError) {
        console.error('Failed to send internal notification email:', emailError);
      }
      
      return res.status(201).json({
        message: "Contact message submitted successfully",
        customerEmailSent,
        internalEmailSent,
        data: newMessage
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      
      return res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // ===== ENDPOINTS DE ODOO (protected — admin only) =====
  
  // Test de conexión con Odoo
  app.get(`${apiPrefix}/odoo/test`, authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const result = await testOdooConnection();
      return res.json(result);
    } catch (error) {
      console.error("Error testing Odoo connection:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error testing Odoo connection" 
      });
    }
  });

  // Estadísticas de leads en Odoo
  app.get(`${apiPrefix}/odoo/stats`, authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const result = await getOdooLeadStats();
      return res.json(result);
    } catch (error) {
      console.error("Error getting Odoo stats:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error getting Odoo stats" 
      });
    }
  });

  // Procesar formulario y enviar a Odoo
  app.post(`${apiPrefix}/odoo/submit`, authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const {
        name,
        email,
        company,
        phone,
        message,
        source,
        product,
        actionType,
        language,
        units,
        interest
      } = req.body;

      // Validar campos requeridos
      if (!name || !email || !message || !actionType || !language) {
        return res.status(400).json({
          success: false,
          message: "Campos requeridos faltantes"
        });
      }

      // Procesar en Odoo
      const result = await processFormSubmission({
        name,
        email,
        company: company || '',
        phone: phone || '',
        message,
        source: source || 'Website',
        product,
        actionType,
        language,
        units,
        interest
      });

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: "Formulario procesado exitosamente en Odoo",
          odooLeadId: result.odooLeadId,
          odooContactId: result.odooContactId
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message
        });
      }

    } catch (error) {
      console.error("Error processing form for Odoo:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  });

  // Dynamic rendering for SEO — serve HTML with proper meta tags for bots
  const BOT_AGENTS = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegram/i;
  const SITE = 'https://www.americanchassisdepot.com';

  function isBot(ua: string | undefined): boolean {
    return BOT_AGENTS.test(ua || '');
  }

  function esc(s: string): string {
    return s.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildMetaHtml(opts: { title: string; description: string; url: string; image?: string; lang: string; jsonLd?: object }): string {
    const altLang = opts.lang === 'es' ? 'en' : 'es';
    const altUrl = opts.url.replace(`/${opts.lang}/`, `/${altLang}/`);
    const img = opts.image || `${SITE}/attached_assets/triaxle_20.webp`;
    const ld = opts.jsonLd ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>` : '';
    return `<!DOCTYPE html>
<html lang="${opts.lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}"/>
<link rel="canonical" href="${opts.url}"/>
<link rel="alternate" hreflang="${opts.lang}" href="${opts.url}"/>
<link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${esc(opts.title)}"/>
<meta property="og:description" content="${esc(opts.description)}"/>
<meta property="og:url" content="${opts.url}"/>
<meta property="og:image" content="${img}"/>
<meta property="og:locale" content="${opts.lang === 'es' ? 'es_MX' : 'en_US'}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(opts.title)}"/>
<meta name="twitter:description" content="${esc(opts.description)}"/>
<meta name="twitter:image" content="${img}"/>
${ld}
</head>
<body>
<div id="root"></div>
<script>window.location.href="${opts.url}";</script>
</body>
</html>`;
  }

  function serveSpaFallback(_req: Request, res: Response, next: () => void) {
    if (process.env.VERCEL) {
      const indexPath = path.resolve(import.meta.dirname, '..', 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    }
    return next();
  }

  app.get('/:lang(en|es)/marketplace/listing/:slug', async (req: Request, res: Response, next: any) => {
    if (!isBot(req.headers['user-agent'])) return serveSpaFallback(req, res, next);

    try {
      const { lang, slug } = req.params;
      const listing = await getListingBySlug(slug);
      if (!listing) return serveSpaFallback(req, res, next);

      const title = lang === 'es'
        ? `${listing.titleEs || listing.title} | American Chassis Depot`
        : `${listing.title} | American Chassis Depot`;
      const desc = lang === 'es'
        ? (listing.descriptionEs || listing.description || '').slice(0, 160)
        : (listing.description || '').slice(0, 160);

      const html = buildMetaHtml({
        title,
        description: desc,
        url: `${SITE}/${lang}/marketplace/listing/${slug}`,
        image: listing.primaryImageUrl || undefined,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: listing.title,
          description: listing.description,
          image: listing.primaryImageUrl,
          offers: {
            '@type': 'Offer',
            price: listing.pricePerUnit,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            itemCondition: listing.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
          },
        },
      });
      res.set('Content-Type', 'text/html').send(html);
    } catch {
      serveSpaFallback(req, res, next);
    }
  });

  const STATIC_PAGES: Record<string, { en: { title: string; desc: string }; es: { title: string; desc: string } }> = {
    '': {
      en: { title: 'American Chassis Depot | Container Chassis for Sale', desc: 'Premium new and used intermodal container chassis. Tandem and triaxle chassis for 20ft, 40ft, 45ft, and 53ft containers.' },
      es: { title: 'American Chassis Depot | Chasis de Contenedor en Venta', desc: 'Chasis intermodales nuevos y usados premium. Chasis tandem y triaxle para contenedores de 20, 40, 45 y 53 pies.' },
    },
    'marketplace': {
      en: { title: 'Chassis Marketplace | Buy & Sell Container Chassis', desc: 'Browse hundreds of new and used container chassis listings from verified sellers across the United States.' },
      es: { title: 'Marketplace de Chasis | Compra y Venta de Chasis', desc: 'Explora cientos de listados de chasis de contenedor nuevos y usados de vendedores verificados en Estados Unidos.' },
    },
    'products': {
      en: { title: 'All Chassis Models | American Chassis Depot', desc: 'Explore our complete catalog of intermodal container chassis models from top manufacturers.' },
      es: { title: 'Todos los Modelos de Chasis | American Chassis Depot', desc: 'Explora nuestro catálogo completo de modelos de chasis intermodales de los mejores fabricantes.' },
    },
    'about': {
      en: { title: 'About Us | American Chassis Depot', desc: 'Learn about American Chassis Depot, your trusted source for intermodal container chassis solutions.' },
      es: { title: 'Sobre Nosotros | American Chassis Depot', desc: 'Conoce American Chassis Depot, tu fuente confiable de soluciones de chasis intermodales.' },
    },
    'contact': {
      en: { title: 'Contact Us | American Chassis Depot', desc: 'Get in touch with our sales team for quotes, support, and chassis inquiries.' },
      es: { title: 'Contáctanos | American Chassis Depot', desc: 'Comunícate con nuestro equipo de ventas para cotizaciones, soporte y consultas sobre chasis.' },
    },
    'new-chassis': {
      en: { title: 'New Container Chassis | American Chassis Depot', desc: 'Browse our selection of brand new intermodal container chassis from leading manufacturers.' },
      es: { title: 'Chasis Nuevos de Contenedor | American Chassis Depot', desc: 'Explora nuestra selección de chasis intermodales nuevos de los principales fabricantes.' },
    },
    'used-chassis': {
      en: { title: 'Used Container Chassis | American Chassis Depot', desc: 'Quality pre-owned intermodal container chassis at competitive prices.' },
      es: { title: 'Chasis Usados de Contenedor | American Chassis Depot', desc: 'Chasis intermodales usados de calidad a precios competitivos.' },
    },
  };

  app.get('/:lang(en|es)/:page(*)', (req: Request, res: Response, next: any) => {
    if (!isBot(req.headers['user-agent'])) return serveSpaFallback(req, res, next);

    const { lang, page } = req.params;
    const pageKey = page.replace(/\/$/, '');
    const meta = STATIC_PAGES[pageKey];
    if (!meta) return serveSpaFallback(req, res, next);

    const data = meta[lang as 'en' | 'es'] || meta.en;
    const html = buildMetaHtml({
      title: data.title,
      description: data.desc,
      url: `${SITE}/${lang}/${pageKey}`,
      lang,
    });
    res.set('Content-Type', 'text/html').send(html);
  });

  app.get('/:lang(en|es)', (req: Request, res: Response, next: any) => {
    if (!isBot(req.headers['user-agent'])) return serveSpaFallback(req, res, next);

    const { lang } = req.params;
    const data = STATIC_PAGES[''][lang as 'en' | 'es'] || STATIC_PAGES[''].en;
    const html = buildMetaHtml({
      title: data.title,
      description: data.desc,
      url: `${SITE}/${lang}`,
      lang,
    });
    res.set('Content-Type', 'text/html').send(html);
  });

  const httpServer = createServer(app);
  return httpServer;
}
