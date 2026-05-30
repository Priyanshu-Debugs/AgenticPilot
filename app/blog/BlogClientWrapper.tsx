"use client";

import { Navigation } from "@/components/shared/Navigation";
import { useAuth } from "@/utils/auth/AuthProvider";

export function BlogClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navUser = user
    ? {
        name: user.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.avatar_url || user.user_metadata?.avatar_url || "",
      }
    : undefined;

  return (
    <>
      <Navigation
        isAuthenticated={!!user}
        user={navUser}
        onSignIn={() => (window.location.href = "/auth/signin")}
        onSignUp={() => (window.location.href = "/auth/signup")}
        onSignOut={() => {
          void signOut();
        }}
      />
      {children}
    </>
  );
}
