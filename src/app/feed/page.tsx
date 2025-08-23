"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/loading-spinner";
import React from "react";

const FeedPage = () => {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is null (during logout), show loading spinner
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Feed!</h1>
        <p className="text-lg mb-2">
          Hello, {user.firstName} {user.lastName}!
        </p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          {user.bio && <p className="mb-2">{user.bio}</p>}
          {user.age && <p className="mb-2">Age: {user.age}</p>}
          <p className="text-sm">Projects: {user.projects.length}</p>
          <p className="text-sm">Followers: {user.followers.length}</p>
          <p className="text-sm">Following: {user.following.length}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
