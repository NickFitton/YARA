"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormEvent } from "react";

export const SignUpForm = () => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="inputs flex flex-col gap-2">
        <div className="flex flex-row gap-6">
          <div>
            <Label htmlFor="signup-first-name">First Name</Label>
            <Input
              id="signup-first-name"
              name="name"
              type="text"
              autoComplete="given-name"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="signup-last-name">Last Name</Label>
            <Input
              id="signup-last-name"
              name="name"
              type="text"
              autoComplete="family-name"
              required
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="signup-email">Email address</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        <Link href="/login">
          <Button type="button" variant="secondary" className="w-full">
            Sign in
          </Button>
        </Link>
      </div>
    </form>
  );
};
