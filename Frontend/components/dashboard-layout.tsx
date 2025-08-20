"use client";

import type React from "react";
import { useState, useEffect } from "react";
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

interface UserData {
  id: number;
  email: string;
  role: string;
  avatar?: string | null;
  institution_id?: number | null;
}

interface InstitutionData {
  id: number;
  name: string;
  contact_person?: string;
  email?: string | null;
  phone?: string;
  address?: string;
  type?: string;
  status?: string;
  services?: string[] | string;
}

interface ApiResponse {
  user: UserData;
  institution?: InstitutionData | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "consumer" | "provider" | "contactperson";
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [pathname]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (pathname !== "/login") {
            router.push("/login");
          }
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const handleRefresh = () => {
    try {
      setIsRefreshing(true);
      fetchUserData();
      router.refresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUserData(null);
      router.push("/login");
    }
  };

  const getNavigationItems = (): NavigationItem[] => {
    if (!userData) return [];

    const role = userData.user.role.toLowerCase();

    switch (role) {
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
      case "contactperson":
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
    if (!userData) {
      return null;
    }

    const { user, institution } = userData;

    const name =
      institution?.contact_person || user.email.split("@")[0] || "User";

    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      name,
      email: user.email,
      avatar,
      institution: institution?.name,
      role: user.role,
    };
  };

  const getProfileUrl = (): string => {
    if (!userData) return "/login";

    const role = userData.user.role.toLowerCase();

    const profilePages: Record<string, string> = {
      admin: "/admin/profile",
      consumer: "/consumer/profile",
      provider: "/provider/profile",
      contactperson: "/consumer/profile",
    };

    return profilePages[role] || "/profile";
  };

  const getRoleDisplayName = (): string => {
    if (!userData) return "";

    return (
      userData.user.role.charAt(0).toUpperCase() + userData.user.role.slice(1)
    );
  };

  // Don't render anything if we're on the login page
  if (pathname === "/login") {
    return null;
  }

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Authentication failed. Please try logging in again.</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();
  const userInfo = getUserInfo();

  if (!userInfo) {
    return null;
  }

  const roleDisplayName = getRoleDisplayName();

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
                const IconComponent = item.icon;

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
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu & Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>

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
                      {userInfo.institution && (
                        <p className="text-xs text-muted-foreground">
                          {userInfo.institution}
                        </p>
                      )}
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {roleDisplayName}
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
                const IconComponent = item.icon;

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
                    <IconComponent className="h-5 w-5" />
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
