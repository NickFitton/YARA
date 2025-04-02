import { PropsWithChildren } from "react";
import React from "react";
import Sidebar from "@/components/organisms/sidebar";

export default function RecipesLayout({
  modal,
  children,
}: PropsWithChildren<{ modal: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      {children}
      {modal}
    </div>
  );
}
