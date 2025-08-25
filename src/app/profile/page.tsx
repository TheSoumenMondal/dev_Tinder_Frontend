"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/loading-spinner";
import { useUserStore } from "@/utils/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { IconDeviceFloppy, IconEye } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import PreviewDialog from "@/components/custom/preview-dialog";
import axiosInstance from "@/utils/axios-instance";
import { userApi } from "@/apis/user-api";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, isLoading } = useRequireAuth();
  const { setInitialUser } = useUserStore();

  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [age, setAge] = useState<number>(user?.age || 0);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [loading, setLoading] = useState<boolean>(false);

  // Update form state when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || 0);
      setAvatarUrl(user.avatarUrl || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(userApi.updateProfile, {
        firstName,
        lastName,
        age,
        avatarUrl,
        bio,
      });
      setInitialUser(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full pt-20 px-4 h-screen flex items-center justify-center">
      <Card className="max-w-xl w-full px-0">
        <CardTitle className="px-6 text-2xl">Profile</CardTitle>
        <CardContent className="flex flex-col gap-1.5">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <Label htmlFor="avatar-url">Avatar URL</Label>
          <Input
            id="avatar-url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Label htmlFor="email">Email</Label>
          <Input value={user.email} readOnly />
        </CardContent>
        <CardFooter className="md:grid md:grid-cols-7 gap-2 flex flex-col">
          <Button
            className="w-full md:col-span-5"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"} <IconDeviceFloppy />{" "}
          </Button>
          {/* Pass a draft user object to PreviewDialog so preview reflects form state
              without mutating global store until update succeeds */}
          <PreviewDialog
            buttonStyle="w-full md:col-span-2"
            user={{
              ...user,
              firstName,
              lastName,
              age,
              avatarUrl,
              bio,
            }}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
