"use client"

import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Message} from "@/app/_providers/intl/message"
import {useIntl} from "@/app/_providers/intl/intl-provider"
import {Languages} from "lucide-react"
import {LOCALES} from "@/lib/constants";

const LanguageToggle = () => {
  const {setLocale, locale} = useIntl()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages/>
          <div className="absolute bottom-0 left-0 text-xs text-muted-foreground uppercase">{locale}</div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((_locale) =>
          <DropdownMenuItem onClick={() => setLocale(_locale)} key={_locale}>
            <Message value={`locale.${_locale}`}/>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;