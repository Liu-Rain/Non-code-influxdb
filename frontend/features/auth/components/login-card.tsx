"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-login";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type FormData = z.infer<typeof loginSchema>;

export function LoginCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isError, isPending, reset } = useLogin();

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  if (isError) {
    toast.error("Invalid username or password");
  }

  return (
    <Card variant="ghost" className="w-[350px]">
      <CardHeader>
        <CardTitle variant="center">Login</CardTitle>
        <CardDescription variant="center">
          Enter your username below <br />
          to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                onFocus={reset}
                {...register("username")}
                placeholder="Enter your username"
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <span className="text-sm text-destructive">
                  {errors.username.message ?? " "}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onFocus={reset}
                {...register("password")}
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <span className="text-sm text-destructive">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <CardFooter className="relative mt-4 flex flex-col gap-2 px-0">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
