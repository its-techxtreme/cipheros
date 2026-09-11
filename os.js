const clock = document.querySelector("#clock");
const board = document.querySelector("#board");
const tapeTitle = document.querySelector("#tape-title");

const apps = {
  notebook: document.querySelector("#win-notebook"),
  files: document.querySelector("#win-files"),
  hoodies: document.querySelector("#win-hoodies"),
  shredder: document.querySelector("#win-shredder"),
  welcome: document.querySelector("#win-welcome"),
  clock: document.querySelector("#win-clock"),
};

const pinFor = {
  notebook: "#pin-notebook",
  files: "#pin-files",
  hoodies: "#pin-hoodies",
  shredder: "#pin-shredder",
  welcome: "#pin-notebook",
  clock: "#tack-clock",
};

let topZ = 30;

function shown(win) {
  return win && win.style.display !== "none";
}

function xy(el, how) {
  if (!el || !board) return { x: 40, y: 40 };
  const b = board.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  if (how === "tab") return { x: r.left - b.left + 26, y: r.top - b.top + 8 };
  return {
    x: r.left - b.left + r.width / 2,
    y: how === "pin" ? r.top - b.top + 5 : r.top - b.top + r.height / 2,
  };
}

function dropTack(name) {
  let t = document.querySelector("#drop-" + name);
  if (!t) {
    t = document.createElement("i");
    t.className = "tack leftover";
    t.id = "drop-" + name;
    t.style.display = "none";
    board.append(t);
  }
  return t;
}

function hideDrop(name) {
  const d = document.querySelector("#drop-" + name);
  if (d) d.style.display = "none";
}

function curve(id, a, b) {
  const path = document.querySelector(id);
  if (!path || !a || !b) return;
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
  const my = (a.y + b.y) / 2 + 48;
  path.setAttribute("d", "M " + a.x + " " + a.y + " Q " + mx + " " + my + " " + b.x + " " + b.y);
}

function endFor(name, win) {
  if (shown(win)) {
    hideDrop(name);
    return xy(win.querySelector(".win-tab") || win, "tab");
  }
  const drop = document.querySelector("#drop-" + name);
  if (drop && drop.style.display !== "none") return xy(drop);
  return xy(document.querySelector(pinFor[name]), "pin");
}

function strings() {
  const svg = document.querySelector("#strings");
  if (!svg || !board) return;
  const w = board.clientWidth;
  const h = board.clientHeight;
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  Object.keys(pinFor).forEach((name) => {
    curve("#s-" + name, xy(document.querySelector(pinFor[name]), "pin"), endFor(name, apps[name]));
  });
}

function pad(n) {
  return (n < 10 ? "0" : "") + n;
}

function tick() {
  if (!clock) return;
  const now = new Date();
  let h = now.getHours();
  const am = h < 12;
  h = h % 12 || 12;
  const tail = am ? " am" : " pm";
  clock.textContent = h + ":" + pad(now.getMinutes()) + tail;
  const face = document.querySelector("#watch-now");
  if (face) face.textContent = h + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds()) + tail;
}

function markDock(win) {
  const name = win && win.id ? win.id.replace("win-", "") : "";
  document.querySelectorAll(".dock-app").forEach((chip) => {
    chip.classList.toggle("on", !!name && chip.dataset.app === name);
  });
}

function topOpen() {
  let best = null;
  let z = -1;
  Object.values(apps).forEach((w) => {
    if (!shown(w)) return;
    const n = parseInt(w.style.zIndex, 10) || 0;
    if (n >= z) {
      z = n;
      best = w;
    }
  });
  return best;
}

function front(win) {
  topZ += 1;
  win.style.zIndex = topZ;
  strings();
  markDock(win);
}

function openWin(name) {
  const win = apps[name];
  if (!win) return;

  win.style.display = "flex";
  hideDrop(name);
  front(win);
  requestAnimationFrame(strings);
}

function closeWin(win) {
  if (!win) return;
  const name = win.id.replace("win-", "");
  const p = xy(win.querySelector(".win-tab") || win, "tab");
  const t = dropTack(name);
  t.style.left = p.x - 6 + "px";
  t.style.top = p.y - 6 + "px";
  t.style.display = "block";
  win.style.display = "none";
  strings();
  markDock(topOpen());
}

function pin(id, name) {
  const btn = document.querySelector(id);
  if (btn) btn.addEventListener("click", () => openWin(name));
}

function placeForDrag(win) {
  if (win.style.left && win.style.top) return;

  // shredder is stuck with right/bottom in css. lock left/top once or it jumps
  const boardBox = board.getBoundingClientRect();
  const winBox = win.getBoundingClientRect();

  win.style.left = `${winBox.left - boardBox.left}px`;
  win.style.top = `${winBox.top - boardBox.top}px`;
  win.style.right = "auto";
  win.style.bottom = "auto";
}

function draggy(win) {
  const tab = win.querySelector(".win-tab");
  if (!tab) return;

  win.addEventListener("pointerdown", () => front(win));

  tab.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return; // x sits on the tab

    placeForDrag(win);
    front(win);

    const winBox = win.getBoundingClientRect();
    const shiftX = event.clientX - winBox.left;
    const shiftY = event.clientY - winBox.top;

    function move(next) {
      const boardBox = board.getBoundingClientRect();
      const maxX = board.clientWidth - win.offsetWidth;
      const maxY = board.clientHeight - win.offsetHeight;
      const x = next.clientX - boardBox.left - shiftX;
      const y = next.clientY - boardBox.top - shiftY;

      win.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
      win.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
      strings();
    }

    function done() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", done);
    }

    event.preventDefault();
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", done);
  });
}

Object.values(apps).forEach((win) => {
  if (!win) return;
  draggy(win);

  const x = win.querySelector(".win-x");
  if (x) x.addEventListener("click", () => closeWin(win));
});

pin("#pin-notebook", "notebook");
pin("#pin-files", "files");
pin("#pin-hoodies", "hoodies");
pin("#pin-shredder", "shredder");

tapeTitle.addEventListener("click", () => openWin("welcome"));
if (clock) clock.addEventListener("click", () => openWin("clock"));

Object.entries(apps).forEach(([name, win]) => {
  if (!win) return;
  if (name !== "welcome") win.style.display = "none"; // only welcome on boot
});

markDock(apps.welcome);

tick();
setInterval(tick, 1000);
strings();
window.addEventListener("resize", strings);
