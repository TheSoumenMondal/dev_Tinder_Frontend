"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/loading-spinner";
import useUserStore from "@/utils/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, isLoading } = useRequireAuth(); // Get loading state
  const { logout } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Show spinner while redirecting unauthenticated users
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is null (during logout), show loading spinner
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto pt-20 px-4">
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg">{user.email}</p>
          </div>

          {user.bio && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <p className="text-lg">{user.bio}</p>
            </div>
          )}

          {user.age && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Age
              </label>
              <p className="text-lg">{user.age}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.projects.length}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.followers.length}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.following.length}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
