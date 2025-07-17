import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertReviewSchema, type InsertReview } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import StarRating from "./star-rating";

export default function ReviewForm() {
  const [selectedRating, setSelectedRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<InsertReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      review: "",
      rating: 0,
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: InsertReview) => apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      toast({
        title: "Review Submitted Successfully!",
        description: "Your review has been submitted and will be reviewed by our team before being published.",
      });
      reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/approved"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = (data: InsertReview) => {
    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate({ ...data, rating: selectedRating });
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Leave a Review</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <Label className="block text-sm font-medium text-gray-700 mb-3">Rate Your Experience</Label>
                <div className="flex justify-center">
                  <StarRating
                    value={selectedRating}
                    onChange={handleRatingChange}
                    size="lg"
                  />
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review">Your Review *</Label>
                <Textarea
                  id="review"
                  {...register("review")}
                  placeholder="Share your experience with us..."
                  className={`resize-none ${errors.review ? "border-red-500" : ""}`}
                  rows={4}
                />
                {errors.review && (
                  <p className="text-sm text-red-600 mt-1">{errors.review.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="bg-primary hover:bg-blue-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  {createReviewMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
