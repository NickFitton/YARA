"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type HeaderLinkProps = {
  title: string;
  href: string;
};

export const HeaderLink = ({ title, href }: HeaderLinkProps) => {
  const pathname = usePathname();
  const active = pathname.includes(href);

  return (
    <Link
      className={`text-sm font-medium hover:underline underline-offset-4 h-full justify-center items-center flex px-4 ${
        active ? "bg-slate-100" : ""
      }`}
      href={href}
    >
      <div>
        <span>{title}</span>
      </div>
    </Link>
  );
};
