"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "./login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Hourglass } from "lucide-react";
import { useRouter } from "next/navigation";
import { attemptLogin } from "./login.action";
import { useState } from "react";

export const LoginForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginSchema) => {
    setIsPending(true);
    // I'd like to be able to tanstack this
    const response = await attemptLogin(data);
    if ("accessToken" in response && response.accessToken) {
      router.push("/dashboard");
    }
    setIsPending(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="flex flex-row gap-3 justify-between items-center">
            <Link
              className="w-32 text-sm hover:underline underline-offset-4 flex flex-row gap-1 items-center"
              href="/sign-up"
            >
              Sign up
            </Link>
            <Button className="w-32" type="submit" disabled={isPending}>
              {isPending ? <Hourglass size="1rem" /> : "Sign in"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
