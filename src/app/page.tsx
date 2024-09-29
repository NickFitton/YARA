import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, BookOpen, Search, Upload, Tags } from "lucide-react";
import "./style.css";

const HEADER_LINKS: { title: string; href: string }[] = [
  { title: "Features", href: "#" },
  { title: "Contact", href: "#" },
  { title: "Login", href: "#" },
];
const FOOTER_LINKS: { title: string; href: string }[] = [
  { title: "Terms of Service", href: "#" },
  { title: "Privacy Policy", href: "#" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">MyRecipeVault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {HEADER_LINKS.map(({ title, href }) => (
            <Link
              key={href}
              className="text-sm font-medium hover:underline underline-offset-4"
              href={href}
            >
              {title}
            </Link>
          ))}
        </nav>
      </header>
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
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Easy Search</h3>
                <p className="text-muted-foreground">
                  Quickly find any recipe in your collection with our powerful
                  search feature.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Import Recipes</h3>
                <p className="text-muted-foreground">
                  Easily import recipes from websites or input your own family
                  favorites.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <Tags className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Organize & Tag</h3>
                <p className="text-muted-foreground">
                  Keep your recipes organized with custom categories and tags.
                </p>
              </div>
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 MyRecipeVault. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          {FOOTER_LINKS.map(({ title, href }) => (
            <Link
              key={href}
              className="text-xs hover:underline underline-offset-4"
              href={href}
            >
              {title}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
