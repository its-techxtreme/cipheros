const noteKey = "cipheros-notes";

const fileBlurb = {
  about: "Desk map. Polaroids on the left. Folders on the cork. Wood strip at the bottom.",
  build: "Active case is CASE 0. Three Campfire Flagship Hoodies missing from the swag shelf. Sizes L, M, S.",
  music: "Loop pile: late night coding playlists and game OSTs.",
};

let notes = grab(noteKey, []);
// localstorage can be cursed. dont trust it
if (!Array.isArray(notes)) notes = [];

let noteList;
let noteInput;
let filePaper;

function showWin(win) {
  if (win) openWin(win.id.replace("win-", ""));
}

function tag(name, className, text) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function drawNotes() {
  noteList.textContent = "";

  if (notes.length === 0) {
    noteList.append(tag("p", "empty", "No notes yet."));
    return;
  }

  notes.forEach((text, index) => {
    const row = tag("div", "note-row");
    const words = tag("span", "", text);
    const scratch = tag("button", "", "scratch");

    scratch.type = "button";
    scratch.addEventListener("click", () => {
      notes.splice(index, 1);
      stash(noteKey, notes);
      drawNotes();
    });

    row.append(words, scratch);
    noteList.append(row);
  });
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  notes.push(text);
  stash(noteKey, notes);
  noteInput.value = "";
  drawNotes();
}

function setupNotebook() {
  const body = document.querySelector("#win-notebook .win-body");
  if (!body) return;

  const tools = tag("div", "note-tools");
  const add = tag("button", "", "pin note");

  noteList = tag("div");
  noteList.id = "note-list";
  noteInput = tag("input");
  noteInput.id = "note-input";
  noteInput.type = "text";
  noteInput.placeholder = "write a clue";
  add.type = "button";
  add.id = "note-add";

  body.textContent = "";
  body.classList.add("lined");
  tools.append(noteInput, add);
  body.append(noteList, tools, tag("p", "tiny", "Saved in this browser."));

  add.addEventListener("click", addNote);
  noteInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addNote();
  });

  drawNotes();
}

function setupFiles() {
  const body = document.querySelector("#win-files .win-body");
  if (!body) return;

  const shelf = tag("div", "file-shelf");
  const stuff = [
    ["about", "desk map"],
    ["build", "active case"],
    ["music", "loop pile"],
    ["hoodies", "CASE 0"],
  ];

  body.textContent = "";
  filePaper = tag("p", "", "Open a card.");
  filePaper.id = "file-paper";

  stuff.forEach(([name, label]) => {
    const btn = tag("button", "file-card", label);
    btn.type = "button";
    btn.dataset.file = name;
    btn.addEventListener("click", () => {
      // CASE 0 is its own folder, not a note on the paper
      if (name === "hoodies") {
        showWin(document.querySelector("#win-hoodies"));
        return;
      }

      filePaper.textContent = fileBlurb[name];
    });
    shelf.append(btn);
  });

  body.append(shelf, filePaper);
}

function setupHoodies() {
  const body = document.querySelector("#win-hoodies .win-body");
  if (!body) return;

  // no shop photos. blobs with a ? will have to do
  const wall = tag("div", "hoodie-wall");

  body.textContent = "";
  body.classList.add("hoodie-case");
  body.append(
    tag("p", "case-stamp", "MISSING / CASE 0"),
    tag("p", "", "Campfire Flagship Hoodies missing from the swag shelf. Sizes L, M, and S. No photos of the real ones, so these are stand-ins.")
  );

  ["L", "M", "S"].forEach((size) => {
    const card = tag("article", "hoodie-photo");
    const shot = tag("div", "hoodie-shot hoodie-" + size.toLowerCase());

    card.append(
      shot,
      tag("strong", "", "MISSING"),
      tag("span", "", "Campfire Flagship Hoodie (" + size + ")")
    );
    wall.append(card);
  });

  body.append(wall);
}

function setupShredder() {
  const body = document.querySelector("#win-shredder .win-body");
  if (!body) return;

  const strips = tag("div", "paper-strips");

  body.textContent = "";
  body.classList.add("shredder-box");
  // fake strips. it still hasnt eaten anything
  for (let i = 0; i < 5; i += 1) strips.append(tag("i"));

  body.append(
    tag("div", "shred-mouth"),
    tag("p", "", "Evidence destroyed: 0"),
    tag("p", "tiny", "Empty."),
    strips
  );
}

function setupClock() {
  const body = document.querySelector("#win-clock .win-body");
  if (!body) return;

  const face = tag("div", "watch-face");
  const now = tag("p", "");
  now.id = "watch-now";

  body.textContent = "";
  body.classList.add("watch-box");
  body.append(face, now, tag("p", "tiny", "The time on the tape opens this folder."));
}

setupNotebook();
setupFiles();
setupHoodies();
setupShredder();
setupClock();
strings();
tick();
