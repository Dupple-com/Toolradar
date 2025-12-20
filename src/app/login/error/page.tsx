"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have access to this resource.",
  Verification: "The verification token has expired or has already been used.",
  OAuthSignin: "Error starting the OAuth sign-in flow.",
  OAuthCallback: "Error during the OAuth callback. This could be due to a misconfigured provider or a token issue.",
  OAuthCreateAccount: "Could not create OAuth provider account.",
  EmailCreateAccount: "Could not create email provider account.",
  Callback: "Error in the OAuth callback handler.",
  OAuthAccountNotLinked: "This email is already associated with another account. Try signing in with a different provider.",
  EmailSignin: "Failed to send verification email.",
  CredentialsSignin: "Invalid credentials.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An unexpected error occurred.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card rounded-xl border p-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          {error && (
            <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted p-2 rounded">
              Error code: {error}
            </p>
          )}
          <div className="space-y-2">
            <Link
              href="/login"
              className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-2 text-muted-foreground hover:text-foreground"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
