function grab(key, backup) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : backup;
  } catch (err) {
    // leftover junk in storage. just start over
    return backup;
  }
}

function stash(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadScript(src, done) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = done;
  document.body.append(script);
}

// windows have to exist before we stuff them
loadScript("os.js", () => loadScript("apps.js"));
