// src/app/page.jsx
"use client";

import { useEffect, useState } from "react";
// import Map from "../components/Map"; // normal import now that this page is client-only
import { auth, githubProvider, db } from "../../lib/firebaseClient"; // client firebase init
import { signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  fetchGitHubProfile,
  fetchGitHubRepos,
  fetchGitHubRepoLanguages,
  geocodeLocation,
} from "../../lib/github";
import UserDetailsPanel from "../components/UserDetailsPanel";
import TopBar from "../components/TopBar";
import dynamic from "next/dynamic";


const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
})

export default function Home() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    (async () => {
      try {
        const res = await fetch("/api/users");
        const j = await res.json();
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


      const token = credential?.accessToken;
      if (!token){
        console.error("No GitHub access token returned from Firebase Auth. Check provider config.");
        alert("GitHub login succeeded but no access token was returned. Check console.");
        return;
      }
      
      const firebaseUser = result.user; // use clear name

      // fetch GitHub data using token (do NOT store token in Firestore)
      const profile = await fetchGitHubProfile(token);
      if (profile && profile._error){
        alert(`GitHub profile fetch failed: ${profile.body?.message || profile.status}`);
        return;
      }

      const reposResult = await fetchGitHubRepos(token);
      if (reposResult?.__error){
        console.error("GitHub repos fetch failed:", reposResult);
      }
      const repos = Array.isArray(reposResult) ? reposResult : [];

      const TOP_REPOS_LIMIT = 20;

      const enrichedRepos = await Promise.all(
        repos.slice(0, TOP_REPOS_LIMIT).map(async (repo) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            languages: await fetchGitHubRepoLanguages(repo, token),
            updated_at: repo.updated_at,
        }))
      );

      const geo = await geocodeLocation(profile.location, {contactEmail: "your-email@example.com"});

      await setDoc(
        doc(db, "users", firebaseUser.uid), {
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
        alert("An account already exists with the same email. PLease use a different sign-in method.");
      } else {
        alert("Login failed — check console");
      }
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>

      <TopBar
        user={user}
        onLogin={login}
        onLogout={logout}
      />

      <div style={{flex: 1, display: "flex"}}>
        <div style={{ flex: 1 }}>
        <Map onSelectUser={setSelectedUser} />
        </div>
        <UserDetailsPanel user={selectedUser} />
      </div>
    </div>
  );
}
