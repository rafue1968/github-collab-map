export async function fetchGitHubProfile(token) {
  return fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
}

export async function fetchGitHubRepos(token, perPage = 100) {
  // simple pagination to fetch all public repos (stops when empty page returned)
  let page = 1;
  const all = [];
  while (true) {
    const url = `https://api.github.com/user/repos?type=public&per_page=${perPage}&page=${page}&sort=updated`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
    const json = await res.json();
    if (!res.ok) return { __error: true, status: res.status, body: json };
    if (!Array.isArray(json) || json.length === 0) break;
    all.push(...json);
    if (json.length < perPage) break; // likely last page
    page++;
    // small delay to be polite
    await new Promise(r => setTimeout(r, 100));
  }
  return all;
}

export async function fetchGitHubRepoLanguages(repo, token) {
  try {
    const res = await fetch(repo.languages_url, { headers: { Authorization: `Bearer ${token}` }});
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    return {};
  }
}


export async function geocodeLocation(locationText, { contactEmail = "your-email@example.com", maxRetries = 2 } = {}) {
  if (!locationText) return null;

  const q = encodeURIComponent(locationText);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&addressdetails=0&email=${encodeURIComponent(contactEmail)}`;
  const data = await fetch(url).then(r => r.json());

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": `github-collab-map/1.0 (${contactEmail})`,
          "Accept-Language": "en"
        }
      });

      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) return null;

      return ({
        lat: parseFloat(json[0].lat),
        lng: parseFloat(json[0].lon)
      });
    } catch (err) {
      if (attempt === maxRetries) return null;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return null;
}



