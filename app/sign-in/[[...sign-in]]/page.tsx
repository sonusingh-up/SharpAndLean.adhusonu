import { SignIn } from '@clerk/nextjs';
import { Logo } from '@/components/site';
export const metadata = { title: 'Sign in', robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <main id="main" className="auth-page">
      <Logo />
      <SignIn />
    </main>
  );
}
