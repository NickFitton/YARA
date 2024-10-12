import Link from "next/link";
import { BookOpen, Search, Upload, Tags, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";
import "./style.css";
import { ReactNode } from "react";

const Feature = ({
  Icon,
  title,
  description,
}: {
  Icon: ({ className }: { className: string }) => ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="bg-primary text-primary-foreground p-3 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Personal Recipe Sanctuary
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Organize, store, and access your favorite recipes in one
                    secure place. Never lose a cherished family recipe again.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#features">
                    <Button className="inline-flex items-center justify-center">
                      Explore Features
                      <BookOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#signup">
                    <Button variant="outline">Sign Up Today</Button>
                  </Link>
                </div>
              </div>
              <img
                alt="Recipe organization"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src="https://placehold.co/550x550"
                width="550"
              />
            </div>
          </div>
        </section>
        <section id="features" className="bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                Icon={Search}
                title="Easy Search"
                description="Quickly find any recipe in your collection with our powerful search feature."
              />
              <Feature
                Icon={Upload}
                title="Import Recipes"
                description="Easily import recipes from websites, books or input your own family favorites."
              />
              <Feature
                Icon={Tags}
                title="Organize & Tag"
                description="Keep your recipes organized with custom categories and tags."
              />
            </div>
            <div className="flex flex-row justify-center">
              <Link href="/roadmap">
                <Button className="inline-flex items-center justify-center">
                  View Roadmap
                  <Route className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="signup" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Your Recipe Journey
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up now and manage your recipes with ease. No credit card
                  required.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-2">
                  <Input
                    className="max-w-lg"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
