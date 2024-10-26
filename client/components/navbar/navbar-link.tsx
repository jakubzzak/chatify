'use client'

import { cn } from "@/lib/utils";
import {usePathname} from "next/navigation";
import Link, {LinkProps} from "next/link";
import {LinkHTMLAttributes} from "react";
import {buttonVariants} from "@/components/ui/button";
import {Message} from "@/app/_providers/intl/message";

type NavbarLinkProps = {
  text: string
} & LinkHTMLAttributes<LinkProps>

export const NavbarLink = ({ href, text, children, className }: NavbarLinkProps) => {
  const pathname = usePathname()

  const isSelected = pathname.includes(href) && href !== "/" ? true : pathname === href

  return (
    <Link href={href}
          className={cn(buttonVariants({ variant: "ghost" }), "flex flex-row items-center gap-2 justify-center p-3 rounded-xl", isSelected && "underline underline-offset-2", className)}>
      {children}
      <span className="hidden sm:block">
        <Message value={text} />
      </span>
    </Link>
  )
}