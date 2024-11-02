import { AuthProvider } from '@/app/_providers/auth';
import { Navbar } from '@/components/navbar';

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar variant="private" />
      <div className="flex flex-col min-h-[calc(100vh-4.5rem)] px-4 pb-4 w-full items-center justify-center">
        {children}
      </div>
    </AuthProvider>
  );
}
