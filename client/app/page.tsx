import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/app/_providers/theme/theme-toggle";

export default function Home() {
  return (
    <div className="">
      <ThemeToggle />
      <Button>
        test
      </Button>
    </div>
  );
}
