"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {useUserStore} from "@/utils/store";

export const useAuth = (requireAuth: boolean = true) => {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (requireAuth && !isAuthenticated()) {
      setIsRedirecting(true);
      router.push("/");
    } else if (!requireAuth && isAuthenticated()) {
      setIsRedirecting(true);
      router.push("/feed");
    }
  }, [user, requireAuth, isAuthenticated, router]);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading: isRedirecting,
  };
};

export const useRequireAuth = () => {
  const result = useAuth(true);
  return {
    ...result,
    user: result.user, 
  };
};
export const useRequireGuest = () => {
  const result = useAuth(false);
  return result; 
};
