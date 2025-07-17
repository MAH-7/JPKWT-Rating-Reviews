import { Link, useLocation } from "wouter";
import { Star, Home, Settings } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Star className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">JPK Wilayah Timur Reviews</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className={`font-medium transition-colors ${location === '/' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                <Home className="w-4 h-4 mr-2 inline" />
                Public View
              </button>
            </Link>
            <Link href="/admin">
              <button className={`font-medium transition-colors ${location === '/admin' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                <Settings className="w-4 h-4 mr-2 inline" />
                Admin Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
