"use client"

import Link, {LinkProps} from "next/link";
import {useSearchParams} from "next/navigation";
import {AnchorHTMLAttributes, useCallback} from "react";

export function LinkWithSearchParams({href, children, ...props}: AnchorHTMLAttributes<LinkProps>) {
  const searchParams = useSearchParams()

  const hrefWithSearchParams = useCallback(
    () => {
      const params = new URLSearchParams(searchParams.toString())

      return params.toString().length === 0 ? href : href + "?" + params.toString()
    },
    [searchParams]
  )

  return (
    // @ts-ignore
    <Link href={hrefWithSearchParams()} {...props}>
      {children}
    </Link>
  )
}