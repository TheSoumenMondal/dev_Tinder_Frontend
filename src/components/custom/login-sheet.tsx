"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";
import { userApi } from "@/apis/user-api";
import axiosInstance from "@/utils/axios-instance";
import {useUserStore} from "@/utils/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginSheetProps {
  triggerContent?: string;
  triggerClassName?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  onTriggerClick?: () => void;
  renderTrigger?: boolean;
}

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginSheet({
  triggerContent = "Login",
  triggerClassName = "",
  triggerVariant = "default",
  triggerSize = "sm",
  open,
  className,
  onOpenChange,
  onTriggerClick,
  renderTrigger = true,
}: LoginSheetProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setInitialUser } = useUserStore();
  const router = useRouter();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(userApi.loginApi, data);
      if (!response.data.data) {
        toast.error(response.data.message);
      }

      if (response.data && response.data.data) {
        setInitialUser(response.data.data);
        toast.success("Login successful!");
        setIsOpen(false);
        reset();
        router.push("/feed");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerClick = () => {
    onTriggerClick?.();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {renderTrigger && (
        <Button
          size={triggerSize}
          variant={triggerVariant}
          className={`${triggerClassName}`}
          onClick={handleTriggerClick}
        >
          {triggerContent}
        </Button>
      )}
      <SheetContent
        side="bottom"
        className="fixed left-1/2 w-full max-w-3xl -translate-x-1/2 rounded-t-2xl border bg-background shadow-lg p-6 md:pb-0"
      >
        <SheetHeader className="pb-0">
          <SheetTitle className="text-2xl">Login</SheetTitle>
          <SheetDescription>
            Enter your email and password to login to your account.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 p-3 pt-0 pb-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            asChild
            variant={"link"}
            disabled={isLoading}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <Link
              href="/auth/sign-up"
              className="text-sm text-muted-foreground"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
