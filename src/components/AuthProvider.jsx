// components/AuthProvider.jsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseClient"; // <- import the client-side auth instance

const AuthCtx = createContext({ user: null, loading: true });
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // subscribe to auth state changes only on the client
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []); // no auth in deps; we import client-side singleton

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>;
}
