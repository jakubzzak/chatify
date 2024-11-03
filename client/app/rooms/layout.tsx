import { AuthProvider } from '@/app/_providers/auth';
import { Navbar } from '@/components/navbar';
import { Rooms } from '@/app/_components/rooms';

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar variant="private" />
      <div className="flex flex-col min-h-[calc(100vh-5rem)] pl-[21rem] px-4 pb-4 w-full items-center justify-center">
        <Rooms />
        {children}
      </div>
    </AuthProvider>
  );
}
