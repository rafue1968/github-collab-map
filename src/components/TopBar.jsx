"use client";

export default function TopBar({ user, onLogin, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <strong>GitHub-Collab-Map</strong>
      </div>

      <div className="topbar-right">
        {user ? (
          <div className="topbar-user">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="avatar"
                className="topbar-avatar"
              />
            )}
            <span className="topbar-name">
              {user.displayName || user.email}
            </span>
            <button className="btn btn-link" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onLogin}>
            Sign in with GitHub
          </button>
        )}
      </div>
    </header>
  );
}
