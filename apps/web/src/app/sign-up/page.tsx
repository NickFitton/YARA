import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { SignUpForm } from "./sign-up";
import { Footer } from "@/components/organisms/footer";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              MyRecipeVault
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Create a new account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SignUpForm />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in or creating an account, you agree to our{" "}
          <Link
            href="#"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </main>
      <Footer />
    </div>
  );
}
