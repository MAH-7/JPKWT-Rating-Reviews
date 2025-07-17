
import { Link, useLocation } from "wouter";
import { Home, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Public View", icon: Home },
    { href: "/admin", label: "Admin Dashboard", icon: Settings },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2D3B8F] to-[#1E2563] rounded-xl shadow-lg flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 100 100" className="text-white">
                    <circle cx="50" cy="25" r="15" fill="currentColor"/>
                    <path d="M20 75 L35 40 L50 65 L65 40 L80 75 Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-md"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#2D3B8F] to-[#1E2563] bg-clip-text text-transparent">
                  JPK Wilayah Timur
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Review System</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`relative group flex items-center px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#2D3B8F] to-[#1E2563] text-white shadow-lg shadow-[#2D3B8F]/25"
                        : "text-slate-600 hover:text-[#2D3B8F] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2.5" />
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#2D3B8F] rounded-full shadow-md"></div>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2D3B8F]/5 to-[#1E2563]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#2D3B8F] hover:bg-slate-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200/60">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#2D3B8F] to-[#1E2563] text-white shadow-lg shadow-[#2D3B8F]/25"
                        : "text-slate-600 hover:text-[#2D3B8F] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
