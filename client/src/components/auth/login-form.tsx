"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoughNotation } from "react-rough-notation";
import Link from "next/link";
import BtnLoader from "../loader";
import { loginUser } from "@/api/auth";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const { email, password } = data;

    try {
      const response = await loginUser(email, password);
      if (response.success && response.data) {
        const { token, userData, message } = response.data;
        toast.success(message || "Welcome back");
        login(token, userData);
      } else {
        toast.error(response.data.message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Continue to{" "}
          <RoughNotation
            type="highlight"
            animate
            show
            color="#7f22fe"
            animationDuration={1000}
            key={Object.keys(errors).length}
          >
            <span className="font-merienda text-2xl font-bold text-white">
              SheetSync
            </span>
          </RoughNotation>
        </h1>
        <p className="text-muted-foreground text-sm text-center">
          Enter your email below to login
        </p>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full mt-3">
          {loading ? <BtnLoader /> : "Sign In"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup">
          <RoughNotation
            type="underline"
            animate
            show
            color="#7f22fe"
            strokeWidth={2}
            animationDuration={700}
            key={Object.keys(errors).length}
          >
            Sign Up
          </RoughNotation>
        </Link>
      </div>
    </form>
  );
}
