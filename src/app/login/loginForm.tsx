"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export const LoginForm = () => {
  return (
    <form className="space-y-6" action="#" method="POST">
      <div>
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <Label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
          >
            Remember me
          </Label>
        </div>

        <div className="text-sm">
          <Link
            href="#"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <Link href="/sign-up">
          <Button type="submit" variant="secondary" className="w-full">
            Sign up
          </Button>
        </Link>
      </div>
    </form>
  );
};
