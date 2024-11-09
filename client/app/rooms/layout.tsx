import { AuthProvider } from '@/app/_providers/auth';
import { Navbar } from '@/components/navbar';
import { GraphqlProvider } from '@/app/_providers/graphql';
import { Rooms } from '@/app/_components/rooms';

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <GraphqlProvider>
        <Navbar variant="private" />
        <div className="flex min-h-[calc(100vh-3.5rem)] p-4 w-full gap-4">
          {children}
        </div>
      </GraphqlProvider>
    </AuthProvider>
  );
}
