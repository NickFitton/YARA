import Link from "next/link";
import { HeaderLink } from "./header-link";
import { UtensilsCrossed } from "lucide-react";

const HEADER_LINKS: { title: string; href: string }[] = [
  { title: "Roadmap", href: "/roadmap" },
  { title: "Contact", href: "/contact-us" },
  { title: "Login", href: "/login" },
];

export const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <UtensilsCrossed className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">MyRecipeVault</span>
      </Link>
      <nav className="ml-auto flex h-full">
        {HEADER_LINKS.map((props) => (
          <HeaderLink {...props} key={props.href} />
        ))}
      </nav>
    </header>
  );
};
