"use client";

import { userApi } from "@/apis/user-api";
import axiosInstance from "@/utils/axios-instance";
import {useUserStore} from "@/utils/store";
import LoadingSpinner from "@/components/common/loading-spinner";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { user, setInitialUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/", "/auth/sign-up"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(userApi.getMyProfile);

      if (response.data && response.data.data) {
        setInitialUser(response.data.data);

        if (isPublicRoute && pathname === "/") {
          router.push("/feed");
        }
      } else {
        clearUser();

        if (!isPublicRoute) {
          router.push("/");
        }
      }
    } catch (error: any) {
      clearUser();
      if (error.response?.status === 401) {
        if (!isPublicRoute) {
          toast.error("Please log in to access this page");
          router.push("/");
        }
      } else {
        console.error("Authentication check failed:", error);
        if (!isPublicRoute) {
          router.push("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user && isPublicRoute && pathname === "/") {
        router.push("/feed");
      } else if (!user && !isPublicRoute) {
        router.push("/");
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <div>{children}</div>;
};

export default AuthProvider;
