// components/ClientLayout.jsx
"use client";
import AuthProvider from "./AuthProvider";

export default function ClientLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
