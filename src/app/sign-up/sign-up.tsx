"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Hourglass } from "lucide-react";
import { useSignUp } from "./sign-up.hook";
import { userCreationFormSchema, UserCreationForm } from "./sign-up.schema";

export const SignUpForm = () => {
  const { isPending, mutate } = useSignUp();
  const form = useForm<UserCreationForm>({
    resolver: zodResolver(userCreationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: UserCreationForm) => {
    console.log(data);
    mutate(data, {
      onSuccess: (resp) => {
        console.log("Request was successful");
        console.log(resp);
      },
      onError: (e) => {
        console.error("Request failed");
        console.error(e);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
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
              href="/login"
            >
              <ChevronLeft />
              Back to login
            </Link>
            <Button className="w-32" type="submit" disabled={isPending}>{isPending ? <Hourglass size="1rem"/> : "Submit"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
