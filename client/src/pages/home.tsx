import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import ReviewForm from "@/components/review-form";
import ReviewCard from "@/components/review-card";

export default function Home() {
  const [displayCount, setDisplayCount] = useState(6);
  
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews/approved"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/reviews/stats"],
  });

  const displayedReviews = reviews?.slice(0, displayCount) || [];
  const hasMore = reviews && reviews.length > displayCount;

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-xl text-blue-100 mb-8">
            Help us improve by sharing your feedback about our workplace services
          </p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {stats?.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {stats?.approvedReviews || 0}
              </div>
              <div className="text-blue-100">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <ReviewForm />

      {/* Published Reviews Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            What Others Are Saying
          </h3>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1 mr-3">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMore}
                    variant="ghost"
                    className="text-primary hover:text-blue-700"
                  >
                    Load More Reviews
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">JPK Wilayah Timur</h3>
            <p className="text-gray-400 mb-4">Your feedback helps us improve our services</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
