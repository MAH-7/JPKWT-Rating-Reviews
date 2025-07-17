import { reviews, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like } from "drizzle-orm";

export interface IStorage {
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  updateReviewStatus(id: number, status: "approved" | "rejected"): Promise<Review | undefined>;
  getApprovedReviews(): Promise<Review[]>;
  
  // Analytics
  getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  }>;
  
  // Search and filter
  searchReviews(query: string): Promise<Review[]>;
  filterReviews(status?: string, rating?: number): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.submittedAt));
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async updateReviewStatus(id: number, status: "approved" | "rejected"): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  async getApprovedReviews(): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.status, "approved"))
      .orderBy(desc(reviews.submittedAt));
  }

  async getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  }> {
    const allReviews = await db.select().from(reviews);
    const approvedReviews = allReviews.filter(r => r.status === "approved");
    
    const ratingDistribution: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    approvedReviews.forEach(review => {
      const ratingKey = review.rating.toString();
      if (ratingDistribution[ratingKey] !== undefined) {
        ratingDistribution[ratingKey]++;
      }
    });

    const averageRating = approvedReviews.length > 0 
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
      : 0;

    return {
      totalReviews: allReviews.length,
      pendingReviews: allReviews.filter(r => r.status === "pending").length,
      approvedReviews: allReviews.filter(r => r.status === "approved").length,
      rejectedReviews: allReviews.filter(r => r.status === "rejected").length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  }

  async searchReviews(query: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(
        or(
          like(reviews.name, `%${query}%`),
          like(reviews.email, `%${query}%`),
          like(reviews.review, `%${query}%`)
        )
      )
      .orderBy(desc(reviews.submittedAt));
  }

  async filterReviews(status?: string, rating?: number): Promise<Review[]> {
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(reviews.status, status));
    }
    
    if (rating) {
      conditions.push(eq(reviews.rating, rating));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(reviews)
        .where(and(...conditions))
        .orderBy(desc(reviews.submittedAt));
    }
    
    return await db.select().from(reviews).orderBy(desc(reviews.submittedAt));
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
