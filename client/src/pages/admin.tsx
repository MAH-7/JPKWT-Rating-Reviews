
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { type Review } from "@shared/schema";
import AdminStats from "@/components/admin-stats";
import AdminTable from "@/components/admin-table";
import LoginForm from "@/components/login-form";

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    enabled: isAuthenticated, // Only fetch data when authenticated
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("adminAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleExportData = () => {
    if (!reviews || reviews.length === 0) {
      toast({
        title: "No Data",
        description: "No reviews available to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create CSV content
      const csvHeaders = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Rating",
        "Review",
        "Status",
        "Submitted Date",
      ];
      const csvRows = reviews.map((review) => [
        review.id,
        `"${review.name.replace(/"/g, '""')}"`,
        review.email,
        `="${review.phone}"`,
        review.rating,
        `"${review.review.replace(/"/g, '""')}"`,
        review.status,
        new Date(review.submittedAt).toLocaleDateString(),
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.join(","))
        .join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reviews_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description:
          "Your data has been exported and downloaded as a CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleExportData}
                className="bg-primary hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <AdminStats />

          {/* Review Management Table */}
          <AdminTable />
        </div>
      </div>
    </div>
  );
}
