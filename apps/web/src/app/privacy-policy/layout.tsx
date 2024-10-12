import { Footer } from "@/components/organisms/footer";
import { Header } from "@/components/organisms/header";
import { PropsWithChildren } from "react";
import "./layout.css"

export default function Layout({ children }: PropsWithChildren<object>) {
  return (
    <>
      <Header />
      <main className="py-8 px-12 max-w-5xl mx-auto content">{children}</main>
      <Footer />
    </>
  );
}
