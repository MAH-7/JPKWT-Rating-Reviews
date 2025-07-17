import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, CheckCircle, BarChart3 } from "lucide-react";

interface StatsData {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

export default function AdminStats() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/reviews/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
                <div className="ml-4">
                  <div className="w-16 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      bgColor: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Approved Reviews",
      value: stats.approvedReviews,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: BarChart3,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <card.icon className={`${card.iconColor} w-6 h-6`} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </div>
                <div className="text-sm text-gray-500">{card.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
