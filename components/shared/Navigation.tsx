"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Mail,
  Package,
  Instagram,
  Bot,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavigationProps {
  items?: NavigationItem[];
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  disableMobileMenu?: boolean;
}

const defaultNavItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blog" },
  { label: "Features", href: "/#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
];

export function Navigation({
  items = defaultNavItems,
  isAuthenticated = false,
  user,
  onSignIn = () => (window.location.href = "/auth/signin"),
  onSignUp = () => (window.location.href = "/auth/signup"),
  onSignOut = () => (window.location.href = "/auth/signin"),
  onToggleSidebar,
  isSidebarOpen = false,
  disableMobileMenu = false,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const isSidebarMode = typeof onToggleSidebar === "function";
  const menuIsOpen = isSidebarMode ? isSidebarOpen : isMobileMenuOpen;

  const toggleMobileMenu = () => {
    if (isSidebarMode) {
      onToggleSidebar?.();
      return;
    }
    if (disableMobileMenu) {
      return;
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignIn = async () => {
    setIsSignInLoading(true);
    try {
      await onSignIn();
    } finally {
      setIsSignInLoading(false);
    }
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Hamburger + Logo */}
          <div className="flex items-center gap-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden transition-all duration-200 hover:scale-105 hover:bg-muted relative z-50 p-2"
              aria-label="Toggle navigation menu"
            >
              <div className="relative size-5">
                <Menu
                  className={`absolute inset-0 size-5 transition-all duration-300 ${menuIsOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}
                />
                <X
                  className={`absolute inset-0 size-5 transition-all duration-300 ${menuIsOpen ? "rotate-0 opacity-100" : "rotate-180 opacity-0"}`}
                />
              </div>
            </Button>
            <Link href="/" className="flex items-center gap-x-2">
              <Bot className="size-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                AgenticPilot
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-x-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Desktop buttons */}
          <div className="hidden md:flex items-center gap-x-2">
            <Link href="/notifications" className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="size-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </Link>
            <ModeToggle />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-8 rounded-full"
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  disabled={isSignInLoading}
                  className="text-sm"
                >
                  {isSignInLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button onClick={onSignUp} className="text-sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button, theme toggle, and sign in */}
          <div className="md:hidden flex items-center gap-x-2">
            <ModeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-8 rounded-full"
                  >
                    <Avatar className="size-6">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                disabled={isSignInLoading}
                className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-transparent text-xs px-2 py-1"
              >
                {isSignInLoading ? "..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer Menu */}
      {!disableMobileMenu && !isSidebarMode && isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />

          {/* Side Drawer */}
          <div
            className={`fixed top-0 left-0 h-screen w-80 bg-background border-r border-border z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link
                href="/"
                className="flex items-center gap-x-2"
                onClick={toggleMobileMenu}
              >
                <Bot className="size-8 text-primary" />
                <span className="text-xl font-bold tracking-tight">
                  AgenticPilot
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-2"
                aria-label="Close menu"
              >
                <X className="size-5 text-black dark:text-white" />
              </Button>
            </div>

            {/* User Info Section (if authenticated) */}
            {isAuthenticated && user && (
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-x-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Content */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Navigation
                  </h3>

                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {item.icon && (
                        <item.icon className="size-4 mr-3 text-muted-foreground" />
                      )}
                      {item.label}
                    </Link>
                  ))}

                  <Link
                    href="/notifications"
                    className="flex items-center px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    onClick={toggleMobileMenu}
                  >
                    <Bell className="size-4 mr-3 text-muted-foreground" />
                    Notifications
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="mt-6 flex flex-col gap-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                      Account
                    </h3>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <User className="size-4 mr-3 text-muted-foreground" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Settings className="size-4 mr-3 text-muted-foreground" />
                      Settings
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onSignOut();
                        toggleMobileMenu();
                      }}
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
