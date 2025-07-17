import { reviews, type Review, type InsertReview } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private reviews: Map<number, Review>;
  private currentId: number;

  constructor() {
    this.reviews = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Add some initial approved reviews for display
    const seedReviews: InsertReview[] = [
      {
        name: "John Smith",
        email: "john@example.com",
        phone: "1234567890",
        rating: 5,
        review: "Excellent service and professional staff. The facilities are well-maintained and the process was smooth."
      },
      {
        name: "Maria Johnson",
        email: "maria@example.com",
        phone: "1234567891",
        rating: 4,
        review: "Good experience overall. The staff was helpful and the environment was professional."
      },
      {
        name: "Ahmad Rahman",
        email: "ahmad@example.com",
        phone: "1234567892",
        rating: 5,
        review: "Outstanding service! The team was very professional and efficient. Highly recommend."
      }
    ];

    seedReviews.forEach(review => {
      const newReview: Review = {
        ...review,
        id: this.currentId++,
        status: "approved",
        submittedAt: new Date()
      };
      this.reviews.set(newReview.id, newReview);
    });
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = {
      ...insertReview,
      id,
      status: "pending",
      submittedAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async updateReviewStatus(id: number, status: "approved" | "rejected"): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review) {
      review.status = status;
      this.reviews.set(id, review);
      return review;
    }
    return undefined;
  }

  async getApprovedReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.status === "approved")
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  }> {
    const allReviews = Array.from(this.reviews.values());
    const approvedReviews = allReviews.filter(r => r.status === "approved");
    
    const ratingDistribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    approvedReviews.forEach(review => {
      ratingDistribution[review.rating.toString()]++;
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
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.reviews.values()).filter(review =>
      review.name.toLowerCase().includes(lowercaseQuery) ||
      review.email.toLowerCase().includes(lowercaseQuery) ||
      review.review.toLowerCase().includes(lowercaseQuery)
    );
  }

  async filterReviews(status?: string, rating?: number): Promise<Review[]> {
    let filtered = Array.from(this.reviews.values());
    
    if (status && status !== "all") {
      filtered = filtered.filter(review => review.status === status);
    }
    
    if (rating) {
      filtered = filtered.filter(review => review.rating === rating);
    }
    
    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
}

export const storage = new MemStorage();
