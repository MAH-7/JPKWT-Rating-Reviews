import { type Review } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./star-rating";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return reviewDate.toLocaleDateString();
  };

  return (
    <Card className="review-card">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <StarRating value={review.rating} readonly size="sm" />
          <span className="text-sm text-gray-500 ml-3">
            {formatDate(review.submittedAt)}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {review.review}
        </p>
        
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {getInitials(review.name)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{review.name}</div>
            <div className="text-sm text-gray-500">Verified Reviewer</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
