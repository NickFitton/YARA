import Link from "next/link";

const FOOTER_LINKS: { title: string; href: string }[] = [
  { title: "Terms of Service", href: "/terms-of-service" },
  { title: "Privacy Policy", href: "/privacy-policy" },
];

export const Footer = () => {
  return (
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
  );
};
