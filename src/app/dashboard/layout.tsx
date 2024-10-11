import { PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Home,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 hidden md:block shadow-md z-20">
        <div className="flex items-center mb-8">
          <BookOpen className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">MyRecipeVault</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Discover
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      {children}
    </div>
  );
}
