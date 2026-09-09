const clock = document.querySelector("#clock");
const board = document.querySelector("#board");
const tapeTitle = document.querySelector("#tape-title");

const apps = {
  notebook: document.querySelector("#win-notebook"),
  files: document.querySelector("#win-files"),
  hoodies: document.querySelector("#win-hoodies"),
  shredder: document.querySelector("#win-shredder"),
  welcome: document.querySelector("#win-welcome"),
};

let topZ = 30;

function shown(win) {
  if (!win) return false;
  return win.style.display !== "none";
}

function spot(el, pinHead) {
  if (!el || !board) return { x: 40, y: 40 };
  const box = board.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    x: r.left - box.left + r.width / 2,
    y: pinHead ? r.top - box.top + 5 : r.top - box.top + r.height / 2,
  };
}

function yank(id, a, b) {
  const line = document.querySelector(id);
  if (!line || !a || !b) return;
  line.setAttribute("x1", a.x);
  line.setAttribute("y1", a.y);
  line.setAttribute("x2", b.x);
  line.setAttribute("y2", b.y);
}

function strings() {
  const svg = document.querySelector("#strings");
  if (!svg || !board) return;

  const w = board.clientWidth;
  const h = board.clientHeight;
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);

  const nb = document.querySelector("#pin-notebook");
  const fl = document.querySelector("#pin-files");
  const hd = document.querySelector("#pin-hoodies");
  const sh = document.querySelector("#pin-shredder");
  const ta = document.querySelector("#tack-a");
  const tb = document.querySelector("#tack-b");
  const tc = document.querySelector("#tack-c");

  yank("#y1", spot(nb, true), spot(fl, true));
  yank("#y2", spot(fl, true), spot(hd, true));
  yank("#y3", spot(hd, true), spot(sh, true));
  yank("#y4", spot(nb, true), spot(ta));
  yank("#y5", spot(fl, true), spot(tb));
  yank("#y6", spot(sh, true), spot(tc));

  if (shown(apps.welcome)) yank("#y7", spot(nb, true), spot(apps.welcome));
  else yank("#y7", spot(nb, true), spot(ta));

  if (shown(apps.files)) yank("#y8", spot(fl, true), spot(apps.files));
  else yank("#y8", spot(hd, true), spot(tb));
}

function tick() {
  if (!clock) return;
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const am = h < 12;
  h = h % 12;
  if (h === 0) h = 12;
  const mm = m < 10 ? "0" + m : "" + m;
  clock.textContent = h + ":" + mm + (am ? " am" : " pm");
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
  front(win);
}

function closeWin(win) {
  if (!win) return;
  win.style.display = "none";
  strings();
  markDock(topOpen());
}

function pin(id, name) {
  const btn = document.querySelector(id);
  if (!btn) return;

  // pins used to be dead. they open folders now
  btn.addEventListener("click", () => openWin(name));
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

Object.entries(apps).forEach(([name, win]) => {
  if (!win) return;
  if (name !== "welcome") win.style.display = "none"; // only welcome on boot
});

markDock(apps.welcome);

tick();
setInterval(tick, 15000); // minutes. dont need every second
strings();
window.addEventListener("resize", strings);
