"use client";

import React from "react";
import { Button } from "../ui/button";
import ThemeToggle from "./theme-toggle";
import { LoginSheet } from "../custom/login-sheet";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import useUserStore from "@/utils/store";
import { userApi } from "@/apis/user-api";
import axiosInstance from "@/utils/axios-instance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth(false); // Don't require auth, just get state
  const { logout } = useUserStore();
  const router = useRouter();

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
    <div className="w-full flex items-center justify-between top-0 fixed max-w-4xl pt-4 px-4 backdrop-blur-2xl select-none z-50">
      <Link href={"/"} className="font-bold text-lg">
        devtinder
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link href="/feed">
              <Button variant="ghost" size="sm">
                Feed
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
            <span className="text-sm">Hello, {user?.firstName}!</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <LoginSheet />
        )}
      </div>
    </div>
  );
};

export default Navbar;
