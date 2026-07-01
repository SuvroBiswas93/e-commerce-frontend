import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your ShopHub account',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-128px)] flex items-center justify-center py-8 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <LoginForm />
    </div>
  );
}
