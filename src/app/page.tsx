"use client";

import LoadingSpinner from "@/components/common/loading-spinner";
import { useRequireGuest } from "@/hooks/useAuth";

export default function Home() {
  const { isLoading } = useRequireGuest();

  if (isLoading) {
    return <LoadingSpinner />;
  }


  return (
    <div className="w-full flex items-center justify-center">
      Hello from homepage
    </div>
  );
}
