"use client";

import { useForm } from "react-hook-form";
import { useRequireGuest } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginSheet } from "@/components/custom/login-sheet";
import { userApi } from "@/apis/user-api";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const { isLoading } = useRequireGuest();
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const onSubmit = async (data: SignUpFormData) => {
    try {
      setSigningUp(true);
      const response = await axiosInstance.post(userApi.signUpApi, data);
      if (response.data.data) {
        toast.success(
          response.data.message || "Sign up successful! Please log in."
        );
        setShowLoginSheet(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Sign up failed. Please try again."
        );
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8 w-full max-w-md h-full flex-col md:bg-card rounded-md bg-transparent">
      <Card className="w-full max-w-lg  min-w-sm bg-transparent md:bg-card border-none md:border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="flex gap-1 flex-col">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex gap-1 flex-col">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4 flex flex-col">
            <Button type="submit" className="w-full">
              {signingUp ? "Signing up..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Login sheet placed outside the form to prevent form submission conflicts */}
      <LoginSheet
        triggerVariant="link"
        triggerContent="Already have an account? Log in"
        open={showLoginSheet}
        onOpenChange={setShowLoginSheet}
      />
    </div>
  );
}
