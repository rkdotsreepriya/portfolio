// Loads posts/posts.json and provides helpers for listing and rendering posts.
// To add a new post: drop a .md file in /posts, then add an entry here.

async function loadPosts() {
  try {
    const res = await fetch("posts/posts.json");
    if (!res.ok) throw new Error("Could not load posts.json");
    const posts = await res.json();
    // newest first
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function loadPostContent(file) {
  const res = await fetch(`posts/${file}`);
  if (!res.ok) throw new Error(`Could not load posts/${file}`);
  const text = await res.text();
  return text;
}
