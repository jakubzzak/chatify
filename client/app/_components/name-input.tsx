"use client"

import {Input} from "@/components/ui/input";
import {useQueryParam} from "@/lib/hooks/use-query-param";
import { buttonVariants} from "@/components/ui/button";
import {LogIn} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Message} from "@/app/_providers/intl/message";
import {LinkWithSearchParams} from "@/components/link-with-search-params";
import {cn} from "@/lib/utils";

export function NameInput() {
  const {update, state} = useQueryParam("username")

  return (
    <div className="flex flex-col space-y-2">
      <Label>
        <Message value="common.username" />
      </Label>
      <div className="flex gap-2 w-full">
        <Input onChange={(value) => update(value)} defaultValue={state}/>
        <LinkWithSearchParams href="/chat" className={cn(buttonVariants({ variant: "default" }))}>
          <LogIn/>
        </LinkWithSearchParams>
      </div>
    </div>
  )
}