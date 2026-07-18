import { useState, useEffect, useCallback, useRef } from "react";
import { demoAdminSession } from "../demo/demoAuth.js";
import { isDemoMode, supabase } from "../lib/supabaseClient";

/**
 * useAuth
 *
 * Tracks the current Supabase Auth session and exposes sign-in/sign-out
 * helpers. Subscribes to supabase.auth.onAuthStateChange so session state
 * stays in sync across tabs and after token refreshes.
 *
 * Extended (Auth & Favourites Architecture Plan §2/§4) with: signUp,
 * signInWithGoogle, signInWithMagicLink, resetPassword, updatePassword,
 * and a database-backed `isAdmin` field (read from `admin_users`, not a
 * hardcoded list) — this is what lets ProtectedRoute distinguish "has a
 * session" from "is actually an admin" (Plan §1.2/§4).
 *
 * Note: this stays a plain hook (no React Context Provider) — every
 * caller across the app already invokes `useAuth()` independently (see
 * AdminLayout, ProtectedRoute, each admin module), and Supabase's own
 * onAuthStateChange event fan-out keeps every instance's `session` in
 * sync regardless of which instance triggered the change. Converting to
 * a real Provider is out of scope for this task per the plan's
 * "minimize unnecessary changes" constraint.
 *
 * @returns {{
 *   session: import('@supabase/supabase-js').Session | null | undefined,
 *   user: import('@supabase/supabase-js').User | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   isAdmin: boolean,
 *   isAdminLoading: boolean,
 *   signIn: (email: string, password: string) => Promise<import('@supabase/supabase-js').Session>,
 *   signUp: (email: string, password: string, fullName?: string) => Promise<import('@supabase/supabase-js').AuthResponse['data']>,
 *   signInWithGoogle: () => Promise<any>,
 *   signInWithMagicLink: (email: string) => Promise<any>,
 *   resetPassword: (email: string) => Promise<any>,
 *   updatePassword: (newPassword: string) => Promise<any>,
 *   signOut: () => Promise<void>,
 * }}
 */
export function useAuth() {
  const [session, setSession] = useState(isDemoMode ? demoAdminSession : undefined);
  const [isAdmin, setIsAdmin] = useState(isDemoMode);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const adminCheckedForUserId = useRef(isDemoMode ? demoAdminSession.user.id : null);
  const isSigningOutRef = useRef(false);

  useEffect(() => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      setIsAdmin(true);
      setIsAdminLoading(false);
      adminCheckedForUserId.current = demoAdminSession.user.id;
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      if (isSigningOutRef.current) {
        setSession(null);
        return;
      }

      setSession(isDemoMode ? demoAdminSession : (data.session ?? null));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;

        if (isSigningOutRef.current) {
          if (event === "SIGNED_OUT" || !newSession) {
            setSession(null);
            setIsAdmin(false);
            adminCheckedForUserId.current = null;
            isSigningOutRef.current = false;
          }
          return;
        }

        setSession(newSession);
      },
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Role check: only re-queries admin_users when the signed-in user id
  // actually changes (not on every token refresh/tab-focus event), and
  // caches the result in this hook's own state alongside the session —
  // see Plan §4's note on ProtectedRoute not re-fetching on every route
  // change.
  useEffect(() => {
    if (isDemoMode) {
      setIsAdmin(true);
      setIsAdminLoading(false);
      adminCheckedForUserId.current = demoAdminSession.user.id;
      return undefined;
    }

    const userId = session?.user?.id ?? null;

    if (!userId) {
      setIsAdmin(false);
      adminCheckedForUserId.current = null;
      return undefined;
    }

    if (adminCheckedForUserId.current === userId) {
      return undefined;
    }

    let isMounted = true;
    adminCheckedForUserId.current = userId;
    setIsAdminLoading(true);

    supabase
      .from("admin_users")
      .select("is_admin")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) return;
        setIsAdmin(!error && !!data?.is_admin);
        setIsAdminLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id]);

  const signIn = useCallback(async (email, password) => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      return demoAdminSession;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setSession(data.session);
    return data.session;
  }, []);

  const signUp = useCallback(async (email, password, fullName) => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      return { user: demoAdminSession.user, session: demoAdminSession };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
      },
    });
    if (error) throw error;
    if (data.session) setSession(data.session);
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      return { user: demoAdminSession.user, session: demoAdminSession };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      return { user: demoAdminSession.user, session: demoAdminSession };
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (isDemoMode) return {};

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    if (isDemoMode) return { user: demoAdminSession.user };

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setSession(demoAdminSession);
      setIsAdmin(true);
      adminCheckedForUserId.current = demoAdminSession.user.id;
      return;
    }

    isSigningOutRef.current = true;
    setSession(null);
    setIsAdmin(false);
    adminCheckedForUserId.current = null;

    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (error) {
      console.error("Sign out failed:", error);
      isSigningOutRef.current = false;
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(
          "sb-" + window.location.hostname + "-auth-token",
        );
        window.localStorage.removeItem(
          "sb-" + window.location.hostname + "-auth-token.1",
        );
        window.localStorage.removeItem("supabase.auth.token");
        window.sessionStorage.removeItem(
          "sb-" + window.location.hostname + "-auth-token",
        );
        window.sessionStorage.removeItem(
          "sb-" + window.location.hostname + "-auth-token.1",
        );
      }
    } catch (storageError) {
      console.error("Failed to clear auth storage:", storageError);
    }

    setSession(null);
    setIsAdmin(false);
    adminCheckedForUserId.current = null;
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading: session === undefined,
    isAdmin,
    isAdminLoading,
    // Expose which user id we've checked admin for (sync value from ref)
    adminCheckedForUserId: adminCheckedForUserId.current,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMagicLink,
    resetPassword,
    updatePassword,
    signOut,
  };
}

export default useAuth;
