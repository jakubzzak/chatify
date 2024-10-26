import {ThemeToggle} from "@/app/_providers/theme/theme-toggle";
import LocaleToggle from "@/app/_providers/intl/locale-toggle";
import {HomeIcon, MessageCircle} from "lucide-react";
import {NavbarLink} from "@/components/navbar/navbar-link";

const links = [
  { key: "navbar.link.home", href: "/", icon: HomeIcon },
  { key: "navbar.link.chat", href: "/chat", icon: MessageCircle },
]

export function Navbar() {
  return (
    <header className="w-full h-14 flex flex-row items-center justify-between gap-x-4 px-2 backdrop-blur-md fixed top-0 right-0 z-10 border-b">
      <div className="flex flex-row gap-x-2">
        {links.map(({ key, href, icon: Icon }) =>
          <NavbarLink key={key} text={key} href={href}>
            <Icon className="w-5 h-5" />
          </NavbarLink>)}
      </div>
      <div className="flex flex-row gap-x-2">
        <LocaleToggle />
        <ThemeToggle/>
      </div>
    </header>
  )
}