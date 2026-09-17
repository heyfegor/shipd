import { notFound } from "next/navigation";

import { AuthCheck } from "./auth-check";

export const metadata = {
  title: "Auth check (dev)",
  robots: { index: false, follow: false },
};

/**
 * Development-only Privy validation route (`/dev/auth-check`).
 *
 * This is NOT the Shipd login or onboarding UI — it exists solely to confirm
 * that Privy initializes, that `ready` resolves, and that authenticated state
 * can be detected. It is hidden (404) in production builds.
 */
export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AuthCheck />;
}
