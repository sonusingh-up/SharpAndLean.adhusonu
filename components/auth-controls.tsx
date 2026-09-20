'use client';
import { Show, SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs';
export function AuthControls() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <div className="auth-controls">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="auth-sign-in">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="auth-sign-up">Sign up</button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
export function EditorSignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button">Sign out</button>
    </SignOutButton>
  );
}
