"use client";

export default function UserDetailsPanel({ user }) {
  if (!user) {
    return (
      <aside className="details-panel empty">
        Select a user on the map
      </aside>
    );
  }

  return (
    <aside className="details-panel">
      <img src={user.avatar} alt={user.github_username} />
      <h3>{user.github_username}</h3>

      {user.bio && <p>{user.bio}</p>}
      {user.location_text && <p>📍 {user.location_text}</p>}

      <a href={user.github_url} target="_blank">
        View GitHub Profile →
      </a>

      <hr />

      <h4>Repositories</h4>
      <ul>
        {user.public_repos?.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
