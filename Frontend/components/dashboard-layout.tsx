"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Shield,
  Building2,
  Plus,
  Activity,
  Bell,
  RefreshCw,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "consumer" | "provider";
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleRefresh = () => {
    try {
      setIsRefreshing(true);
      router.refresh(); // Triggers route revalidation
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500); // Show spinner briefly
    }
  };

  const handleLogout = () => {
    // TODO: Add your logout logic here
    router.push("/login");
  };

  const getNavigationItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin/dashboard", icon: Home },
          {
            name: "Institutions",
            href: "/admin/institutions",
            icon: Building2,
          },
          { name: "API Requests", href: "/admin/requests", icon: FileText },
          { name: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
          { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ];
      case "consumer":
        return [
          { name: "Dashboard", href: "/consumer/dashboard", icon: Home },
          {
            name: "Submit Request",
            href: "/consumer/submit-request",
            icon: Plus,
          },
          { name: "My Requests", href: "/consumer/requests", icon: FileText },
          {
            name: "Notifications",
            href: "/consumer/notifications",
            icon: Bell,
          },
        ];
      case "provider":
        return [
          { name: "Dashboard", href: "/provider/dashboard", icon: Home },
          {
            name: "Incoming Requests",
            href: "/provider/requests",
            icon: FileText,
          },
          { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
          {
            name: "Notifications",
            href: "/provider/notifications",
            icon: Settings,
          },
        ];
      default:
        return [];
    }
  };

  const getUserInfo = () => {
    switch (userRole) {
      case "admin":
        return { name: "Admin User", email: "admin@system.com", avatar: "A" };
      case "consumer":
        return {
          name: "John Consumer",
          email: "john@university.edu",
          avatar: "JC",
        };
      case "provider":
        return {
          name: "Provider User",
          email: "provider@ministry.gov",
          avatar: "P",
        };
      default:
        return { name: "User", email: "user@example.com", avatar: "U" };
    }
  };

  const getProfileUrl = () => {
    return `/${userRole}/profile`;
  };

  

  const navigationItems = getNavigationItems();
  const userInfo = getUserInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DE</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DataExchange
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu & Theme Toggle */}
            <div className="flex items-center space-x-4">

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt={userInfo.name}
                      />
                      <AvatarFallback>{userInfo.avatar}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userInfo.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userInfo.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={getProfileUrl()}
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
