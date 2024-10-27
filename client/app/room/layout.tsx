import { AuthProvider } from '@/app/_providers/auth';

export default function AuthLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
