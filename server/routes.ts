import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema, updateReviewStatusSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all reviews for admin
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Get approved reviews for public view
  app.get("/api/reviews/approved", async (req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approved reviews" });
    }
  });

  // Create new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create review" });
      }
    }
  });

  // Update review status (approve/reject)
  app.patch("/api/reviews/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = updateReviewStatusSchema.parse(req.body);
      
      const updatedReview = await storage.updateReviewStatus(id, status);
      if (!updatedReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      res.json(updatedReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update review status" });
      }
    }
  });

  // Get review statistics
  app.get("/api/reviews/stats", async (req, res) => {
    try {
      const stats = await storage.getReviewStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Search reviews
  app.get("/api/reviews/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const reviews = await storage.searchReviews(query);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to search reviews" });
    }
  });

  // Filter reviews
  app.get("/api/reviews/filter", async (req, res) => {
    try {
      const status = req.query.status as string;
      const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;
      
      const reviews = await storage.filterReviews(status, rating);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
