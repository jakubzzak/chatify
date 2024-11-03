import { AuthProvider } from '@/app/_providers/auth';
import { Navbar } from '@/components/navbar';

export default function AuthLayout({ children, params }) {
  return (
    <AuthProvider>
      <Navbar variant="private" />
      <div className="flex min-h-screen pt-[4.5rem] p-4 w-full md:gap-4">
        {children}
      </div>
    </AuthProvider>
  );
}
