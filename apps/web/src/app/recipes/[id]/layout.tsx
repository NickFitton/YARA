import { PropsWithChildren } from "react";
import React from "react";
import Sidebar from "@/components/organisms/sidebar";

export default function RecipeLayout({ children }: PropsWithChildren<object>) {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      {children}
    </div>
  );
}
