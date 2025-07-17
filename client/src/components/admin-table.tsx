import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { type Review } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import StarRating from "./star-rating";

async function apiRequest(method: string, url: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export default function AdminTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" }) =>
      apiRequest("PATCH", `/api/reviews/${id}/status`, { status }),
    onSuccess: () => {
      toast({
        title: "Review Updated",
        description: "Review status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update review status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (id: number, status: "approved" | "rejected") => {
    updateStatusMutation.mutate({ id, status });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} status-badge ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews?.slice(startIndex, endIndex);

  const totalPages = filteredReviews ? Math.ceil(filteredReviews.length / reviewsPerPage) : 0;

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
            Review Management
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredReviews?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews?.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {getInitials(review.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.name}</div>
                          <div className="text-sm text-gray-500">{review.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StarRating value={review.rating} readonly size="sm" />
                    </td>
                    <td>
                      <div className="max-w-xs truncate">{review.review}</div>
                    </td>
                    <td className="text-gray-500">
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusBadge(review.status)}</td>
                    <td>
                      <div className="flex space-x-2">
                        {review.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusUpdate(review.id, "approved")}
                              disabled={updateStatusMutation.isPending}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusUpdate(review.id, "rejected")}
                              disabled={updateStatusMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(review.id, "rejected")}
                            disabled={updateStatusMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {review.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(review.id, "approved")}
                            disabled={updateStatusMutation.isPending}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
                 {filteredReviews?.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
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
      </CardContent>
    </Card>
  );
}