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

function tick() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function front(win) {
  topZ += 1;
  win.style.zIndex = topZ;
}

function openWin(name) {
  const win = apps[name];
  if (!win) return;

  win.style.display = "flex";
  front(win);
}

function closeWin(win) {
  win.style.display = "none";
}

function pin(id, name) {
  const btn = document.querySelector(id);
  if (!btn) return;

  btn.addEventListener("click", () => openWin(name));
}

function placeForDrag(win) {
  if (win.style.left && win.style.top) return;

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
    if (event.target.closest("button")) return;

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
  if (!win) return;  if (name !== "welcome") win.style.display = "none";

});

tick();
setInterval(tick, 15000);
