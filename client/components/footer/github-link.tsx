"use client"

import GithubDark from "@/public/github.png"
import GithubLight from "@/public/github-light.png"
import Image, {ImageProps} from "next/image";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

type GithubIconProps = {
  alt?: string
} & Omit<ImageProps, "src" | "alt">

export function GithubIcon({className, width = 28, height = 28, alt = "Github", ...props}: GithubIconProps) {
  const {theme, systemTheme} = useTheme()

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return GithubLight
      case "light":
        return GithubDark
      case "system":
        return systemTheme === "dark" ? GithubLight : GithubDark
      default:
        return GithubDark
    }
  }

  const [Icon, setIcon] = useState<any>()

  useEffect(() => {
    setIcon(getIcon())
  }, [theme, systemTheme]);

  return Icon &&
      <Image
          src={Icon}
          priority={true}
          alt={alt}
          width={width}
          height={height}
          className={cn("w-7 h-7", className)}
          {...props}
      />
}