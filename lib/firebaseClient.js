// lib/firebaseClient.js
"use client";

/**
 * Client-only Firebase initializer.
 * Import `auth` and `db` from here in client components only.
 *
 * NOTE: This file must NOT be imported from server components.
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// DEBUG: show what the client sees (mask actual key)
if (typeof window !== "undefined") {
  const masked = firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0,6)}...${firebaseConfig.apiKey.slice(-6)}` : null;
  // eslint-disable-next-line no-console
  console.log("DEBUG FIREBASE CONFIG (client):", {
    apiKeyMask: masked,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  });
}

if (!firebaseConfig.apiKey) {
  // eslint-disable-next-line no-console
  console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY — check .env.local and restart dev server.");
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const githubProvider = new GithubAuthProvider();

// githubProvider.credentialFromResult()
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");
githubProvider.addScope("read:org")
githubProvider.addScope("repo");
githubProvider.setCustomParameters({allow_signup: "false"});
export default app;
