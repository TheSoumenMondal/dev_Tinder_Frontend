"use client";

import FeedCard from "@/components/custom/feed-card";
import LoadingSpinner from "@/components/common/loading-spinner";
import { useRequireGuest } from "@/hooks/useAuth";

export default function Home() {
  const { isLoading } = useRequireGuest(); // Get loading state for redirects

  // Show spinner while redirecting authenticated users
  if (isLoading) {
    return <LoadingSpinner />;
  }


  return (
    <div className="w-full flex items-center justify-center">
      <FeedCard />
    </div>
  );
}
