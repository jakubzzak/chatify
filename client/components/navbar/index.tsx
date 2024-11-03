import { ThemeToggle } from '@/app/_providers/theme/theme-toggle';
import LocaleToggle from '@/app/_providers/intl/locale-toggle';
import { NavbarLink } from '@/components/navbar/navbar-link';
import { UserProfile } from '@/components/navbar/profile';

const publicLinks = [];

const privateLinks = [];

export function Navbar({ variant }: { variant: 'private' | 'public' }) {
  const links = variant === 'public' ? publicLinks : privateLinks;

  return (
    <header className="w-full h-[3.5rem] flex flex-row items-center justify-between gap-x-4 px-2 sm:px-6 backdrop-blur-md fixed top-0 right-0 z-10 border-b">
      <div className="flex flex-row gap-x-2">
        {variant === 'private' && <UserProfile />}
        {links.map(({ key, href, icon: Icon }) => (
          <NavbarLink key={key} text={key} href={href}>
            <Icon className="w-5 h-5" />
          </NavbarLink>
        ))}
      </div>
      <div className="flex flex-row gap-x-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
