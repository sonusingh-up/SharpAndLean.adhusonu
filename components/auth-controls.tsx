'use client';
import { Show, SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs';
export function AuthControls() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <div className="auth-controls">
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
export function AuthMenuControls() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <Show when="signed-out">
      {/* Clicks bubble from either button, so the dropdown closes before Clerk's
          modal opens instead of being left open behind it. */}
      <div
        className="menu-auth"
        onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
      >
        <SignInButton mode="modal">
          <button className="auth-sign-in">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="auth-sign-up">Sign up</button>
        </SignUpButton>
      </div>
    </Show>
  );
}
export function EditorSignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button">Sign out</button>
    </SignOutButton>
  );
}
