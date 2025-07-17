import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { LoadingPage, LoadingCard } from "@/components/loading-spinner";
import { ApiError } from "@/lib/queryClient";
import ReviewForm from "@/components/review-form";
import ReviewCard from "@/components/review-card";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const { 
    data: reviews, 
    isLoading: reviewsLoading, 
    error: reviewsError,
    refetch: refetchReviews 
  } = useQuery<Review[]>({
    queryKey: ["/api/reviews/approved"],
  });

  const { 
    data: stats, 
    isLoading: statsLoading,
    error: statsError 
  } = useQuery({
    queryKey: ["/api/reviews/stats"],
  });

  const totalReviews = reviews?.length || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const displayedReviews = reviews?.slice(startIndex, endIndex) || [];

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    scrollToReviews();
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    scrollToReviews();
  };

  const scrollToReviews = () => {
    setTimeout(() => {
      document
        .getElementById("reviews-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Handle loading states
  if (reviewsLoading) {
    return <LoadingPage text="Loading reviews..." />;
  }

  // Handle error states
  if (reviewsError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load reviews
          </h2>
          <p className="text-gray-600 mb-6">
            {reviewsError instanceof ApiError 
              ? reviewsError.message 
              : "Unable to load reviews. Please try again."}
          </p>
          <Button onClick={() => refetchReviews()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-xl text-blue-100 mb-8">
            Help us improve by sharing your feedback about our workplace
            services
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

      {/* Reviews Section */}
      <div id="reviews-section" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            What Others Are Saying
          </h3>

          {/* Loading state */}
          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(reviewsPerPage)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="flex items-center mb-4 space-x-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                      ))}
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-gray-200 rounded" />
                      <div className="w-20 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Review count */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalReviews)} of{" "}
                  {totalReviews} reviews
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">JPK Wilayah Timur</h3>
            <p className="text-gray-400 mb-4">
              Your feedback helps us improve our services
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
