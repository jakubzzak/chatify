import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/app/_providers/theme/theme-toggle";
import LocaleToggle from "@/app/_providers/intl/locale-toggle";
import {Message} from "@/app/_providers/intl/message";

export default function Home() {
  return (
    <div className="">
      <ThemeToggle />
      <LocaleToggle />
      <Button>
        <Message value="common.remove" />
      </Button>
    </div>
  );
}
