import {GithubIcon} from "@/components/footer/github-link";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Message} from "@/app/_providers/intl/message";
import {COMPANY_NAME, GITHUB_REPO} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full h-16 flex flex-wrap gap-x-2 items-center justify-center border-t p-2 text-xs">
      <Message value="footer.rights" args={{ company: COMPANY_NAME }} />
      <Link href={GITHUB_REPO} className={buttonVariants({variant: "ghost"})}>
        <GithubIcon/>
      </Link>
    </footer>
  )
}