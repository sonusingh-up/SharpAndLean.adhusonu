import { ClerkProvider } from '@clerk/nextjs';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider appearance={{ variables: {
      colorPrimary: '#263b2c',
      borderRadius: '1rem',
      fontFamily: 'var(--font-dm), sans-serif',
    } }}>
      {children}
    </ClerkProvider>
  );
}
