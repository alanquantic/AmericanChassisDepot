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
import { getLandingPage, buildLandingJsonLdGraph, LANDING_PAGES, type LandingPage } from "../shared/landing-pages.js";
import { getResourceArticle, buildArticleJsonLdGraph, RESOURCE_ARTICLES, type ResourceArticle } from "../shared/resources/index.js";
import path from "path";
import fs from "fs";
import {
  isBotIdRequest,
  issueFormToken,
  logSpamRejection,
  validateFormSubmission,
} from "./anti-spam.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = "/api";

  // Register marketplace routes
  app.use(`${apiPrefix}/marketplace`, marketplaceRoutes);

  // Short-lived signed token used by public forms to detect automated submissions.
  app.get(`${apiPrefix}/form-token`, (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token: issueFormToken() });
  });

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
        ...LANDING_PAGES.map((p) => ({ path: `/${p.slug}`, changefreq: 'weekly', priority: '0.8' })),
        { path: '/resources', changefreq: 'weekly', priority: '0.7' },
        ...RESOURCE_ARTICLES.map((a) => ({ path: `/resources/${a.slug}`, changefreq: 'monthly', priority: '0.7' })),
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
      const successResponse = {
        message: "Brochure request processed successfully",
        customerEmailSent: false,
        internalEmailSent: false,
        data: null,
      };
      if (await isBotIdRequest(req)) {
        logSpamRejection("BotID", req.body);
        return res.status(200).json(successResponse);
      }
      const spamCheck = validateFormSubmission(req.body, ["name", "email", "company", "phone"]);
      if (!spamCheck.valid) {
        logSpamRejection(spamCheck.reason, req.body);
        return res.status(200).json(successResponse);
      }

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
      } = req.body;
      
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
      const successResponse = {
        message: "Contact message submitted successfully",
        customerEmailSent: false,
        internalEmailSent: false,
        data: null,
      };
      if (await isBotIdRequest(req)) {
        logSpamRejection("BotID", req.body);
        return res.status(200).json(successResponse);
      }
      const spamCheck = validateFormSubmission(req.body, [
        "name",
        "email",
        "company",
        "phone",
        "units",
        "interest",
        "message",
      ]);
      if (!spamCheck.valid) {
        logSpamRejection(spamCheck.reason, req.body);
        return res.status(200).json(successResponse);
      }

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
      } = req.body;

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
      
      return res.status(200).json({
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
  const BOT_AGENTS = /googlebot|bingbot|yandex|baiduspider|duckduckbot|twitterbot|facebookexternalhit|facebookbot|meta-externalagent|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegram|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-web|anthropic-ai|perplexitybot|perplexity-user|ccbot|bytespider|amazonbot|applebot|cohere-ai|youbot|diffbot|timpibot/i;
  const SITE = 'https://www.americanchassisdepot.com';

  function isBot(ua: string | undefined): boolean {
    return BOT_AGENTS.test(ua || '');
  }

  function esc(s: string): string {
    return s.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildMetaHtml(opts: { title: string; description: string; url: string; image?: string; lang: string; jsonLd?: object; body?: string }): string {
    const altLang = opts.lang === 'es' ? 'en' : 'es';
    const altUrl = opts.url.replace(`/${opts.lang}/`, `/${altLang}/`);
    const xDefaultUrl = opts.url.replace(`/${opts.lang}`, `/en`);
    const img = opts.image || `${SITE}/attached_assets/triaxle_20.webp`;
    // Escape `<` so seller-controlled content can't break out of the ld+json <script> block.
    const ld = opts.jsonLd ? `<script type="application/ld+json">${JSON.stringify(opts.jsonLd).replace(/</g, '\\u003c')}</script>` : '';
    // Bots (incl. AI crawlers) get real, JS-free content — not an empty shell.
    const bodyContent = opts.body || `<main><h1>${esc(opts.title)}</h1><p>${esc(opts.description)}</p></main>`;
    const nav = `<nav aria-label="Site"><a href="${SITE}/${opts.lang}">Home</a> | <a href="${SITE}/${opts.lang}/marketplace">Marketplace</a> | <a href="${SITE}/${opts.lang}/products">Products</a> | <a href="${SITE}/${opts.lang}/new-chassis">New Chassis</a> | <a href="${SITE}/${opts.lang}/used-chassis">Used Chassis</a> | <a href="${SITE}/${opts.lang}/contact">Contact</a></nav>`;
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
<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}"/>
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
${bodyContent}
<hr/>
${nav}
</body>
</html>`;
  }

  // Renders JS-free, semantic content for a marketplace listing so bots and AI
  // crawlers see the actual specs/description/price, not an empty SPA shell.
  function renderListingBody(listing: any, lang: string): string {
    const title = lang === 'es' ? (listing.titleEs || listing.title) : listing.title;
    const desc = lang === 'es' ? (listing.descriptionEs || listing.description || '') : (listing.description || '');
    const rows: string[] = [];
    const addRow = (label: string, val: any) => {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        rows.push(`<tr><th align="left">${esc(label)}</th><td>${esc(String(val))}</td></tr>`);
      }
    };
    addRow(lang === 'es' ? 'Condición' : 'Condition', listing.condition);
    addRow(lang === 'es' ? 'Tipo de chasis' : 'Chassis type', listing.chassisType);
    addRow(lang === 'es' ? 'Tamaño' : 'Size', listing.chassisSize);
    addRow(lang === 'es' ? 'Fabricante' : 'Manufacturer', listing.manufacturer);
    addRow(lang === 'es' ? 'Año' : 'Year', listing.year);
    addRow('VIN', listing.vin);
    addRow(lang === 'es' ? 'Ubicación' : 'Location', [listing.city, listing.state].filter(Boolean).join(', '));
    const specs = listing.specs && typeof listing.specs === 'object' ? listing.specs : null;
    if (specs) {
      const specLabels: Record<string, string> = {
        axleConfig: lang === 'es' ? 'Configuración de ejes' : 'Axle configuration',
        suspension: lang === 'es' ? 'Suspensión' : 'Suspension',
        wheels: lang === 'es' ? 'Ruedas' : 'Wheels',
        configuration: lang === 'es' ? 'Configuración' : 'Configuration',
        widthInches: lang === 'es' ? 'Ancho (pulg.)' : 'Width (in)',
        brakes: lang === 'es' ? 'Frenos' : 'Brakes',
        tires: lang === 'es' ? 'Llantas' : 'Tires',
        gvwrLb: 'GVWR (lb)',
      };
      for (const [k, label] of Object.entries(specLabels)) {
        if (specs[k]) addRow(label, specs[k]);
      }
      if (Array.isArray(specs.features) && specs.features.length) {
        addRow(lang === 'es' ? 'Características' : 'Features', specs.features.join(', '));
      }
    }
    const priceNum = Number(listing.pricePerUnit);
    const priceHtml = Number.isFinite(priceNum) && priceNum > 0
      ? `<p><strong>${lang === 'es' ? 'Precio' : 'Price'}:</strong> $${priceNum.toLocaleString('en-US')} USD</p>`
      : '';
    const specsTable = rows.length
      ? `<h2>${lang === 'es' ? 'Especificaciones' : 'Specifications'}</h2><table>${rows.join('')}</table>`
      : '';
    const descHtml = desc
      ? `<h2>${lang === 'es' ? 'Descripción' : 'Description'}</h2><p>${esc(desc).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      : '';
    const cta = `<p><a href="${SITE}/${lang}/contact">${lang === 'es' ? 'Contactar al vendedor para cotización' : 'Contact seller for a quote'}</a></p>`;
    return `<main><h1>${esc(title)}</h1>${priceHtml}${specsTable}${descHtml}${cta}</main>`;
  }

  // Renders JS-free content for an SEO landing page (Phase 2) from the shared registry.
  function renderLandingBody(page: LandingPage, lang: 'en' | 'es'): string {
    const c = page[lang];
    const intro = c.intro.map((p) => `<p>${esc(p)}</p>`).join('');
    const price = page.priceRange
      ? `<p><strong>${lang === 'es' ? 'Rango de precio orientativo' : 'Typical price range'}:</strong> ${esc(page.priceRange)}</p>`
      : '';
    const specsHeading = page.type === 'product'
      ? (lang === 'es' ? 'Especificaciones' : 'Specifications')
      : page.type === 'service'
        ? (lang === 'es' ? 'Detalles del programa' : 'Program details')
        : (lang === 'es' ? 'En resumen' : 'At a glance');
    const specs = page.specs && page.specs.length
      ? `<h2>${specsHeading}</h2><table>${page.specs
          .map((s) => `<tr><th align="left">${esc(lang === 'es' ? s.labelEs : s.label)}</th><td>${esc(s.value)}</td></tr>`)
          .join('')}</table>`
      : '';
    const sections = c.sections
      .map((sec) => `<h2>${esc(sec.heading)}</h2>${sec.body.map((p) => `<p>${esc(p)}</p>`).join('')}`)
      .join('');
    const faqs = c.faqs.length
      ? `<h2>${lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}</h2>${c.faqs
          .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
          .join('')}`
      : '';
    const cta = `<p><a href="${SITE}/${lang}/contact">${esc(c.ctaHeading)}</a> — ${esc(c.ctaText)}</p>`;
    return `<main><h1>${esc(c.h1)}</h1><p>${esc(c.heroSubtitle)}</p>${price}${intro}${specs}${sections}${faqs}${cta}</main>`;
  }

  // JSON-LD comes from the shared buildLandingJsonLdGraph (same graph the client injects).

  // Renders JS-free content for a /resources article (SEO Phase 3.2).
  function renderArticleBody(article: ResourceArticle, lang: 'en' | 'es'): string {
    const c = article[lang];
    const takeaways = c.keyTakeaways.length
      ? `<h2>${lang === 'es' ? 'Puntos Clave' : 'Key Takeaways'}</h2><ul>${c.keyTakeaways.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>`
      : '';
    const sections = c.sections.map((sec) => {
      const paras = sec.body.map((p) => `<p>${esc(p)}</p>`).join('');
      const list = sec.list ? `<ul>${sec.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
      const table = sec.table
        ? `<table><thead><tr>${sec.table.headers.map((h) => `<th align="left">${esc(h)}</th>`).join('')}</tr></thead><tbody>${sec.table.rows
            .map((r) => `<tr>${r.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table>`
        : '';
      return `<h2>${esc(sec.heading)}</h2>${paras}${list}${table}`;
    }).join('');
    const faqs = c.faqs.length
      ? `<h2>${lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}</h2>${c.faqs
          .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
          .join('')}`
      : '';
    const related = article.relatedLanding
      .map((s) => getLandingPage(s))
      .filter((p): p is LandingPage => Boolean(p))
      .map((p) => `<a href="${SITE}/${lang}/${p.slug}">${esc(p[lang].h1)}</a>`)
      .join(' | ');
    const relatedHtml = related ? `<p>${lang === 'es' ? 'Relacionado' : 'Related'}: ${related}</p>` : '';
    return `<main><article><h1>${esc(c.title)}</h1><p><em>${esc(article.datePublished)}</em></p><p><strong>${esc(c.lead)}</strong></p>${takeaways}${sections}${faqs}${relatedHtml}</article></main>`;
  }

  // Renders the /resources index for bots: title + linked list of all articles.
  function renderResourcesIndexBody(lang: 'en' | 'es'): string {
    const title = lang === 'es' ? 'Recursos y Guías de Chasis' : 'Chassis Resources & Guides';
    const intro = lang === 'es'
      ? 'Guías de compra, comparativas, financiamiento y regulaciones de chasis de contenedor — escritas para transportistas y flotas de drayage.'
      : 'Container chassis buying guides, comparisons, financing, and regulations — written for truckers and drayage fleets.';
    const items = RESOURCE_ARTICLES.map((a) => {
      const c = a[lang];
      return `<li><a href="${SITE}/${lang}/resources/${a.slug}">${esc(c.title)}</a> — ${esc(c.metaDescription)}</li>`;
    }).join('');
    return `<main><h1>${esc(title)}</h1><p>${esc(intro)}</p><ul>${items}</ul></main>`;
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
        body: renderListingBody(listing, lang),
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

  const STATIC_PAGES: Record<string, { en: { title: string; desc: string; body: string }; es: { title: string; desc: string; body: string } }> = {
    '': {
      en: {
        title: 'American Chassis Depot | Container Chassis for Sale',
        desc: 'Premium new and used intermodal container chassis. Tandem and triaxle chassis for 20ft, 40ft, 45ft, and 53ft containers.',
        body: '<main><h1>Container Chassis for Sale &mdash; New &amp; Used</h1><p>American Chassis Depot is a Houston, Texas supplier of new and used intermodal container chassis for trucking, drayage, and logistics companies across the United States.</p><p>Our inventory covers 20ft, 33ft, 40ft, 45ft, 20-40ft extendable, and triaxle configurations, including gooseneck models. We offer direct purchase, chassis leasing, and lease-to-own financing, with fleet discounts on volume orders.</p></main>',
      },
      es: {
        title: 'American Chassis Depot | Chasis de Contenedor en Venta',
        desc: 'Chasis intermodales nuevos y usados premium. Chasis tandem y triaxle para contenedores de 20, 40, 45 y 53 pies.',
        body: '<main><h1>Chasis de Contenedor en Venta &mdash; Nuevos y Usados</h1><p>American Chassis Depot es un proveedor en Houston, Texas de chasis intermodales nuevos y usados para empresas de transporte, drayage y logística en todo Estados Unidos.</p><p>Nuestro inventario incluye configuraciones de 20, 33, 40 y 45 pies, extendibles de 20-40 pies y triaxle, adem&aacute;s de modelos gooseneck. Ofrecemos compra directa, arrendamiento y lease-to-own, con descuentos por volumen.</p></main>',
      },
    },
    'marketplace': {
      en: {
        title: 'Chassis Marketplace | Buy & Sell Container Chassis',
        desc: 'Browse hundreds of new and used container chassis listings from verified sellers across the United States.',
        body: '<main><h1>Chassis Marketplace</h1><p>Browse hundreds of new and used container chassis listings from verified sellers across the United States. Filter by chassis type, size, manufacturer, year, axle configuration, and location to find the right unit.</p><p>Every listing includes full specifications, pricing, and a direct line to contact the seller for a quote.</p></main>',
      },
      es: {
        title: 'Marketplace de Chasis | Compra y Venta de Chasis',
        desc: 'Explora cientos de listados de chasis de contenedor nuevos y usados de vendedores verificados en Estados Unidos.',
        body: '<main><h1>Marketplace de Chasis</h1><p>Explora cientos de listados de chasis de contenedor nuevos y usados de vendedores verificados en todo Estados Unidos. Filtra por tipo, tama&ntilde;o, fabricante, a&ntilde;o, configuraci&oacute;n de ejes y ubicaci&oacute;n.</p><p>Cada listado incluye especificaciones completas, precio y contacto directo con el vendedor para cotizar.</p></main>',
      },
    },
    'products': {
      en: {
        title: 'All Chassis Models | American Chassis Depot',
        desc: 'Explore our complete catalog of intermodal container chassis models from top manufacturers.',
        body: '<main><h1>All Chassis Models</h1><p>Explore our complete catalog of intermodal container chassis: 20ft, 40ft, 45ft, 53ft, extendable, and triaxle models from leading manufacturers.</p><p>Each model page details dimensions, tare weight, GVWR, axles, suspension, and available financing.</p></main>',
      },
      es: {
        title: 'Todos los Modelos de Chasis | American Chassis Depot',
        desc: 'Explora nuestro catálogo completo de modelos de chasis intermodales de los mejores fabricantes.',
        body: '<main><h1>Todos los Modelos de Chasis</h1><p>Explora nuestro cat&aacute;logo completo de chasis intermodales: modelos de 20, 40, 45 y 53 pies, extendibles y triaxle de los mejores fabricantes.</p><p>Cada p&aacute;gina de modelo detalla dimensiones, peso, GVWR, ejes, suspensi&oacute;n y opciones de financiamiento.</p></main>',
      },
    },
    'about': {
      en: {
        title: 'About Us | American Chassis Depot',
        desc: 'Learn about American Chassis Depot, your trusted source for intermodal container chassis solutions.',
        body: '<main><h1>About American Chassis Depot</h1><p>American Chassis Depot is a Houston, Texas dealer specializing in new and used intermodal container chassis. We serve trucking, drayage, and logistics operators nationwide with sales, leasing, and lease-to-own programs.</p></main>',
      },
      es: {
        title: 'Sobre Nosotros | American Chassis Depot',
        desc: 'Conoce American Chassis Depot, tu fuente confiable de soluciones de chasis intermodales.',
        body: '<main><h1>Sobre American Chassis Depot</h1><p>American Chassis Depot es un distribuidor en Houston, Texas especializado en chasis intermodales nuevos y usados. Atendemos a operadores de transporte, drayage y log&iacute;stica en todo el pa&iacute;s con venta, arrendamiento y lease-to-own.</p></main>',
      },
    },
    'contact': {
      en: {
        title: 'Contact Us | American Chassis Depot',
        desc: 'Get in touch with our sales team for quotes, support, and chassis inquiries.',
        body: '<main><h1>Contact American Chassis Depot</h1><p>Get in touch with our Houston, Texas sales team for quotes, availability, leasing, and lease-to-own financing on new and used container chassis. Fleet discounts available on volume orders.</p></main>',
      },
      es: {
        title: 'Contáctanos | American Chassis Depot',
        desc: 'Comunícate con nuestro equipo de ventas para cotizaciones, soporte y consultas sobre chasis.',
        body: '<main><h1>Contacta a American Chassis Depot</h1><p>Comun&iacute;cate con nuestro equipo de ventas en Houston, Texas para cotizaciones, disponibilidad, arrendamiento y financiamiento lease-to-own de chasis nuevos y usados. Descuentos por volumen disponibles.</p></main>',
      },
    },
    'new-chassis': {
      en: {
        title: 'New Container Chassis | American Chassis Depot',
        desc: 'Browse our selection of brand new intermodal container chassis from leading manufacturers.',
        body: '<main><h1>New Container Chassis</h1><p>Browse brand-new intermodal container chassis from leading manufacturers &mdash; 20ft, 40ft, 45ft, extendable, gooseneck, and triaxle configurations. Available for purchase, leasing, or lease-to-own with fleet pricing.</p></main>',
      },
      es: {
        title: 'Chasis Nuevos de Contenedor | American Chassis Depot',
        desc: 'Explora nuestra selección de chasis intermodales nuevos de los principales fabricantes.',
        body: '<main><h1>Chasis Nuevos de Contenedor</h1><p>Explora chasis intermodales nuevos de los principales fabricantes &mdash; configuraciones de 20, 40 y 45 pies, extendibles, gooseneck y triaxle. Disponibles para compra, arrendamiento o lease-to-own con precios de flota.</p></main>',
      },
    },
    'used-chassis': {
      en: {
        title: 'Used Container Chassis | American Chassis Depot',
        desc: 'Quality pre-owned intermodal container chassis at competitive prices.',
        body: '<main><h1>Used Container Chassis</h1><p>Quality pre-owned intermodal container chassis at competitive prices &mdash; inspected units in 20ft, 40ft, 45ft, extendable, and triaxle configurations, with financing available.</p></main>',
      },
      es: {
        title: 'Chasis Usados de Contenedor | American Chassis Depot',
        desc: 'Chasis intermodales usados de calidad a precios competitivos.',
        body: '<main><h1>Chasis Usados de Contenedor</h1><p>Chasis intermodales usados de calidad a precios competitivos &mdash; unidades inspeccionadas en configuraciones de 20, 40 y 45 pies, extendibles y triaxle, con financiamiento disponible.</p></main>',
      },
    },
  };

  app.get('/:lang(en|es)/:page(*)', (req: Request, res: Response, next: any) => {
    if (!isBot(req.headers['user-agent'])) return serveSpaFallback(req, res, next);

    const { lang, page } = req.params;
    const pageKey = page.replace(/\/$/, '');
    const langKey = (lang === 'es' ? 'es' : 'en') as 'en' | 'es';

    // /resources blog (Phase 3.2) — index + articles from the shared registry.
    if (pageKey === 'resources') {
      const title = langKey === 'es' ? 'Recursos y Guías de Chasis | American Chassis Depot' : 'Chassis Resources & Guides | American Chassis Depot';
      const desc = langKey === 'es'
        ? 'Guías de compra, comparativas, financiamiento y regulaciones de chasis de contenedor — escritas para transportistas y flotas de drayage.'
        : 'Container chassis buying guides, comparisons, financing, and regulations — written for truckers and drayage fleets.';
      const html = buildMetaHtml({
        title,
        description: desc,
        url: `${SITE}/${lang}/resources`,
        lang,
        body: renderResourcesIndexBody(langKey),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          url: `${SITE}/${lang}/resources`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: RESOURCE_ARTICLES.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a[langKey].title,
              url: `${SITE}/${lang}/resources/${a.slug}`,
            })),
          },
        },
      });
      return res.set('Content-Type', 'text/html').send(html);
    }
    if (pageKey.startsWith('resources/')) {
      const article = getResourceArticle(pageKey.slice('resources/'.length));
      if (article) {
        const c = article[langKey];
        const html = buildMetaHtml({
          title: c.metaTitle,
          description: c.metaDescription,
          url: `${SITE}/${lang}/${pageKey}`,
          lang,
          body: renderArticleBody(article, langKey),
          jsonLd: buildArticleJsonLdGraph(article, langKey, SITE),
        });
        return res.set('Content-Type', 'text/html').send(html);
      }
      return serveSpaFallback(req, res, next);
    }

    // SEO intent landing pages (Phase 2) — served from the shared registry.
    const landing = getLandingPage(pageKey);
    if (landing) {
      const url = `${SITE}/${lang}/${pageKey}`;
      const c = landing[langKey];
      const html = buildMetaHtml({
        title: c.metaTitle,
        description: c.metaDescription,
        url,
        lang,
        body: renderLandingBody(landing, langKey),
        jsonLd: buildLandingJsonLdGraph(landing, langKey, SITE),
      });
      return res.set('Content-Type', 'text/html').send(html);
    }

    const meta = STATIC_PAGES[pageKey];
    if (!meta) return serveSpaFallback(req, res, next);

    const data = meta[lang as 'en' | 'es'] || meta.en;
    const html = buildMetaHtml({
      title: data.title,
      description: data.desc,
      url: `${SITE}/${lang}/${pageKey}`,
      lang,
      body: data.body,
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
      body: data.body,
    });
    res.set('Content-Type', 'text/html').send(html);
  });

  const httpServer = createServer(app);
  return httpServer;
}
