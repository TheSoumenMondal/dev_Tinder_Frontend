"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import ThemeToggle from "./theme-toggle";
import MobileThemeToggle from "./mobile-theme-toggle";
import { LoginSheet } from "../custom/login-sheet";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/utils/store";
import { userApi } from "@/apis/user-api";
import axiosInstance from "@/utils/axios-instance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu, User, LogOut, Home, Heart, Users, Inbox } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth(false);
  const { logout } = useUserStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post(userApi.logoutApi);
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Controlled login sheet for mobile trigger; no built-in trigger rendered */}
      <LoginSheet
        open={loginOpen}
        onOpenChange={setLoginOpen}
        renderTrigger={false}
      />
      <div className="container flex h-16 max-w-4xl mx-auto items-center justify-between px-4 border-b">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <span>devtinder</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/feed">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  Feed
                </Button>
              </Link>
              <Link href="/requests">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  Requests
                </Button>
              </Link>
              <Link href="/connections">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  Connections
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  Profile
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Hello, {user?.firstName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Logout
              </Button>
            </>
          ) : (
            <LoginSheet />
          )}
        </div>

        {/* Mobile sheet menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="w-full p-6">
              <SheetHeader className="text-center pb-4">
                <SheetTitle className="text-xl font-bold"></SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link href="/feed" className="block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 h-10"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Feed</span>
                          </Button>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link href="/requests" className="block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 h-10"
                          >
                            <Inbox className="w-4 h-4" />
                            <span>Requests</span>
                          </Button>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link href="/connections" className="block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 h-10"
                          >
                            <Users className="w-4 h-4" />
                            <span>Connections</span>
                          </Button>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link href="/profile" className="block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 h-10"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Button>
                        </Link>
                      </SheetClose>

                      <div className="flex justify-start pl-3">
                        <MobileThemeToggle />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-center">
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full max-w-xs justify-center gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-start pl-3">
                      <MobileThemeToggle />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 h-10"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setTimeout(() => setLoginOpen(true), 120);
                        }}
                      >
                        <User className="w-4 h-4" />
                        <span>Login</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
