# 🌍 GitHub-Collab-Map
**Visualising GitHub developers by location to enable local collaboration**

---

## Overview

GitHub-Collab-Map is an interactive web application that allows developers to:
- Sign in with GitHub
- Fetch their public profile and repositories
- Convert location data into geographic coordinates
- Visualise developers on an interactive world map
- Explore nearby developers and their work

The project addresses a key gap in the developer ecosystem:
**GitHub contains rich public data, but no spatial or local discovery layer**.

This capstone explores how existing public data can be transformed into a tool for:
- Local collaboration
- Visibility for early-career developers
- Community building

---

## ❗ Problem Statement
Despite GitHub hosting millions of developers and projects:
- There is no geographic visualisation of developers
- Location data exists but is unstructured and underused
- Discovering collaborators relies on:
- - Social media
- - Word of mouth
- - Global (not local) signals
- Independent and early-career developers lack discoverability
As a result, opportunities for local collaboration, mentorship, and project formation are missed.

---

## 🎯 Project Goal
To design and implement a prototype that:
- Authenticates users via GitHub OAuth
- Fetches and enriches GitHub profile and repository data
- Converts user location into map coordinates
- Displays developers as interactive pins on a map
- Allows users to explore developer profiles via a side panel
This project validates:
- OAuth integration
- API data enrichment
- Geolocation accuracy
- Interactive map UX

---

## 🧱 Features
- 🔐 GitHub OAuth login (via Firebase)
- 👤 GitHub profile and repository fetching
- 🌍 Location geocoding
- 🗺️ Interactive map (Leaflet + OpenStreetMap)
- 📌 Clickable developer pins
- 📂 Side panel showing user details and repositories
- ☁️ Firebase Firestore data storage
- 🎨 Clean, modern UI with top navigation

## 🛠️ Tech Stack
**Frontend**
- Next.js (App Router)
- React
- Leaflet
- OpenStreetMap

**Backend / Services**
- Firebase Authentication
- Firebase Firestore
- GitHub REST API
- OpenStreetMap / Nominatim Geocoding

**Tooling**
- JavaScript (ES6+)
- CSS
- Turbopack (Next.js dev runtime)

## 🧠 Architecture Notes
- Map rendering is client-only using dynamic imports to avoid SSR issues with Leaflet
- GitHub access tokens are never stored
- Only enriched, public profile data is saved to Firestore
- Map and UI are decoupled for maintainability
- Designed as a foundation for future AI-powered features

---

## 📆 Development Timeline (2 Sprints)
### Sprint 1
- GitHub OAuth via Firebase
- Access token handling
- GitHub profile fetching
- Firestore user schema
- OpenStreetMap integration
- Technical troubleshooting of OAuth token exchange
### Sprint 2
- Fetch repositories and languages
- Geocode user locations
- Interactive map with pins
- User selection and side panel
- UX polish and layout improvements

## ✅ Definition of Done
- Users can sign in with GitHub successfully
- GitHub access token is retrieved and used securely
- Profile and repository data are fetched correctly
- User locations appear accurately on the map
- Firestore documents are created/updated per user
- No critical bugs blocking interaction or display


## 🚀 Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/your-username/github-collab-map.git
cd github-collab-map
```
### 2. Install dependencies
```bash
npm install
```
### 3. Environment variables
Create a `.env` file and add:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

* GitHub OAuth Client ID and Secret must be configured in Firebase Authentication.

### 4. Run the app
```bash
npm run dev
```
Open: `http://localhost:3000`

## 🧪 Known Limitations
- Location data depends on user-provided GitHub profile text
- No advanced filtering or search yet
- No mobile optimisation (future work)
- Rate limits apply to GitHub API