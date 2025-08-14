import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage.js";
import { insertContactMessageSchema } from "../shared/schema.js";
import { ZodError } from "zod";
import { sendContactNotification } from "./services/mail.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = "/api";

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

  // Dynamic sitemap by language
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const models = await storage.getAllChassisModels();
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://americanchassisdepot.com';
      const lastmod = new Date().toISOString().slice(0, 10);
      const urls: string[] = [];
      // EN static
      urls.push(`${baseUrl}/en`, `${baseUrl}/en/products`, `${baseUrl}/en/about`, `${baseUrl}/en/contact`);
      // ES home
      urls.push(`${baseUrl}/es`);
      // Products EN/ES
      for (const m of models) {
        const enSlug = m.slug.endsWith('-esp') ? m.slug.slice(0, -4) : m.slug;
        const esSlug = m.slug.endsWith('-esp') ? m.slug : `${m.slug}-esp`;
        urls.push(`${baseUrl}/en/products/${enSlug}`);
        urls.push(`${baseUrl}/es/products/${esSlug}`);
      }
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(u => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`),
        '</urlset>'
      ].join('\n');
      res.setHeader('Content-Type', 'application/xml');
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
      const { name, email, company, phone, chassisName, chassisSlug } = req.body;
      
      // Save the brochure request to database (optional)
      await storage.createContactMessage({
        name,
        email,
        company: company || null,
        phone: phone || null,
        message: `Brochure Request: ${chassisName} (${chassisSlug}) - User requested brochure for chassis`,
        createdAt: new Date().toISOString()
      });

      // For now, return a simple PDF placeholder (in production you'd generate actual PDFs)
      const pdfBuffer = Buffer.from(`
        PDF PLACEHOLDER FOR ${chassisName}
        
        Thank you ${name} from ${company} for your interest in our ${chassisName} chassis.
        
        Contact Information:
        Email: ${email}
        Phone: ${phone}
        
        This is a placeholder response. In production, this would be an actual PDF brochure.
      `);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${chassisSlug}-brochure.pdf"`);
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error("Error processing brochure download:", error);
      return res.status(500).json({ message: "Failed to process brochure download" });
    }
  });

  // Submit contact form
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      // Add timestamp to the message
      const messageData = {
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      
      // Validate the request body
      const validatedData = insertContactMessageSchema.parse(messageData);
      
      // Store the contact message
      const newMessage = await storage.createContactMessage(validatedData);
      
      // Send email notification
      const sourceUrl = validatedData.sourceUrl || 'Unknown source';
      
      let emailSent = false;
      try {
        emailSent = await sendContactNotification(newMessage, sourceUrl);
        if (emailSent) {
          console.log('Contact notification email sent successfully');
        } else {
          console.warn('Contact notification email was not sent (Mailgun might not be configured)');
        }
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
        // Continue execution even if email fails
      }
      
      return res.status(201).json({
        message: "Contact message submitted successfully",
        emailSent: emailSent,
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

  const httpServer = createServer(app);
  return httpServer;
}
