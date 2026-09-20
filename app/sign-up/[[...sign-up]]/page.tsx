import { SignUp } from '@clerk/nextjs';
import { Logo } from '@/components/site';
export const metadata = { title: 'Sign up', robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <main id="main" className="auth-page">
      <Logo />
      <SignUp />
    </main>
  );
}
