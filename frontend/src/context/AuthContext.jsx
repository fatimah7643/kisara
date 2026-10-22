import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { ensureProfile, getProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = (nextSession) => {
      setSession(nextSession);
      setProfile(nextSession?.user ? ensureProfile(nextSession.user) : null);
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) applySession(data.session);
      })
      .catch((err) => console.error("[auth] gagal membaca sesi", err))
      .finally(() => {
        if (active) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const signUp = ({ email, password, name, role, regionInterest }) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role, region_interest: regionInterest } },
    });

  const signOut = () => supabase.auth.signOut();

  // Panggil setelah poin / data profil berubah supaya tampilan ikut diperbarui.
  const refreshProfile = useCallback(() => {
    const userId = session?.user?.id;
    setProfile(userId ? getProfile(userId) : null);
  }, [session]);

  const value = {
    user: session?.user ?? null,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Memuat…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  return ctx;
}