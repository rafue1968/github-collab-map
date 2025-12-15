// src/app/page.jsx
"use client";

import { useEffect, useState } from "react";
import Map from "../components/Map"; // normal import now that this page is client-only
import { auth, githubProvider, db } from "../../lib/firebaseClient"; // client firebase init
import { signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  fetchGitHubProfile,
  fetchGitHubRepos,
  fetchGitHubRepoLanguages,
  geocodeLocation,
} from "../../lib/github";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // subscribe to firebase auth state
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    (async () => {
      try {
        const res = await fetch("/api/users");
        const j = await res.json();
        // optionally set a local state for profiles if you want to show them client-side
      } catch (e) {
        console.error("failed to fetch /api/users", e);
      }
    })();

    return () => unsub();
  }, []);

  async function login() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("SIGNIN RESULT", result);

      const credential = GithubAuthProvider.credentialFromResult(result);

      if (!credential) {
        console.log("Failed to extract GitHub credential from FIrebase Auth result");
        alert("Authentication succeeded but failed to get GitHub access permissions. Please try again.");
        return;
      }

      console.log("CREDENTIAL (maybe null):", credential);

      const token = credential?.accessToken;
      if (!token){
        console.error("No GitHub access token returned from Firebase Auth. Check provider config.");
        alert("GitHub login succeeded but no access token was returned. Check console.");
        return;
      }

      console.log("ACCESS TOKEN:", token);
      
      const firebaseUser = result.user; // use clear name

      // fetch GitHub data using token (do NOT store token in Firestore)
      const profile = await fetchGitHubProfile(token);
      if (profile && profile._error){
        console.error("GitHub profile fetch failed:", profile);
        alert(`GitHub profile fetch failed: ${profile.body?.message || profile.status}`);
        return;
      }

      // const reposResult = await fetchGitHubRepos(token);
      // if (repos && reposResult.__error){
      //   console.error("GitHub repos fetch failed:", reposResult);
      //   alert(`GitHub repos fetch failed: ${reposResult.body?.message || reposResult.status}`);
      //   // We can continue without repos (save profile and coords) — choose your policy.
      // }

      // const repos = Array.isArray(reposResult) ? reposResult : [];
      const repos = await fetchGitHubProfile(token);
      const safeRepos = Array.isArray(repos) ? repos : [];

      const enrichedRepos = await Promise.all(
        safeRepos.map(async (repo) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            languages: await fetchGitHubRepoLanguages(repo, token),
            updated_at: repo.updated_at,
        }))
      );

      const geo = await geocodeLocation(profile.location, {contactEmail: "your-email@example.com"});

      await setDoc(doc(db, "users", firebaseUser.uid), {
        claimed_by_uid: firebaseUser.uid,
        github_uid: profile.id ?? null,
        github_username: profile.login ?? null,
        avatar: profile.avatar_url ?? null,
        bio: profile.bio ?? null,
        github_url: profile.html_url ?? null,
        location_text: profile.location ?? null,
        coords: geo ?? null,
        public_repos: enrichedRepos ?? [],
        public: true,
        lastUpdated: new Date(),
      });

      setUser(firebaseUser);
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential"){
        console.error("Account exists with different credential:", err);
        alert("An account already exists with the same email. PLease use a different sign-in method.");
      } else {
        console.error("login error:", err);
        alert("Login failed — check console");
      }
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <Map firebaseUser={user} />
      </div>

      <aside className="sidebar">
        <h2>GitHub Map</h2>
        {user ? (
          <div>
            <p>Signed in as <strong>{user.displayName || user.email}</strong></p>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Sign in with GitHub to claim your profile</p>
            <button className="btn" onClick={login}>Sign in with GitHub</button>
          </div>
        )}

        <div className="instructions">
          <h4>Instructions</h4>
          <ol>
            <li>Sign in with GitHub</li>
            <li>Claim your profile (the demo saves basic info)</li>
            <li>Click pins on the map and request AI suggestions</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
