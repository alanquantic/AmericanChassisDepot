import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = "/api";

  // Get all brands
  app.get(`${apiPrefix}/brands`, async (_req, res) => {
    try {
      const brands = await storage.getAllBrands();
      return res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      return res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Get brand by slug
  app.get(`${apiPrefix}/brands/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const brand = await storage.getBrandBySlug(slug);
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      return res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      return res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  // Get all chassis models
  app.get(`${apiPrefix}/chassis`, async (req, res) => {
    try {
      const brandSlug = req.query.brand as string | undefined;
      const size = req.query.size as string | undefined;
      
      const models = await storage.filterChassisModels(brandSlug, size);
      return res.json(models);
    } catch (error) {
      console.error("Error fetching chassis models:", error);
      return res.status(500).json({ message: "Failed to fetch chassis models" });
    }
  });

  // Get chassis models by brand
  app.get(`${apiPrefix}/brands/:slug/chassis`, async (req, res) => {
    try {
      const { slug } = req.params;
      const brand = await storage.getBrandBySlug(slug);
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      const models = await storage.getChassisModelsByBrand(brand.id);
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
      
      return res.status(201).json({
        message: "Contact message submitted successfully",
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
