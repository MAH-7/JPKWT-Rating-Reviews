import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminStats from "@/components/admin-stats";
import AdminTable from "@/components/admin-table";

export default function Admin() {
  const { toast } = useToast();

  const handleExportData = () => {
    // In a real application, this would generate and download a CSV/Excel file
    toast({
      title: "Export Started",
      description: "Your data export is being prepared and will be downloaded shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
            <Button
              onClick={handleExportData}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
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
