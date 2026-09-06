const p4NoteKey = "cipheros-notes";
const p4Files = {
  about: "this is my desk if my brain had folders. half notes, half evidence, half nonsense. yes thats three halves.",
  build: "current case: make cipheros pass webos 1 without looking like the guide. folders move now. real apps are happening rn.",
  music: "loop pile: late night coding music, random game osts, and whatever song gets stuck for 4 hours.",
};

let p4Notes = grab(p4NoteKey, []);if (!Array.isArray(p4Notes)) p4Notes = [];

let p4NoteList;
let p4NoteInput;
let p4FilePaper;
function showP4Win(win) {  if (!win) return;
  win.style.display = "flex";  front(win);
}
function ensureP4Win(id, title) {  const old = document.getElementById(id);
  if (old) return old;
  const win = tag("div", "win folder");  const tab = tag("div", "win-tab");
  const x = tag("button", "win-x", "x");  const body = tag("div", "win-body");
  win.id = id;
  x.type = "button";  tab.append(x, tag("span", "", title), tag("i", "dots"));
  win.append(tab, body);  document.querySelector("#board").append(win);
  win.style.display = "none";
  draggy(win);  x.addEventListener("click", () => {
    win.style.display = "none";  });
  return win;
}
















function tag(name, className, text) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function drawP4Notes() {
  p4NoteList.textContent = "";

  if (p4Notes.length === 0) {
    p4NoteList.append(tag("p", "empty", "blank page. weird."));
    return;
  }

  p4Notes.forEach((text, index) => {
    const row = tag("div", "note-row");
    const words = tag("span", "", text);
    const scratch = tag("button", "", "scratch");

    scratch.type = "button";
    scratch.addEventListener("click", () => {
      p4Notes.splice(index, 1);
      stash(p4NoteKey, p4Notes);
      drawP4Notes();
    });

    row.append(words, scratch);
    p4NoteList.append(row);
  });
}

function addP4Note() {
  const text = p4NoteInput.value.trim();
  if (!text) return;

  p4Notes.push(text);
  stash(p4NoteKey, p4Notes);
  p4NoteInput.value = "";
  drawP4Notes();
}

function setupNotebook() {
  const body = document.querySelector("#win-notebook .win-body");  if (!body) return;

  const tools = tag("div", "note-tools");
  const add = tag("button", "", "pin note");

  p4NoteList = tag("div");
  p4NoteList.id = "note-list";
  p4NoteInput = tag("input");
  p4NoteInput.id = "note-input";
  p4NoteInput.type = "text";
  p4NoteInput.placeholder = "clue";
  add.type = "button";
  add.id = "note-add";

  body.textContent = "";
  body.classList.add("lined");
  tools.append(p4NoteInput, add);
  body.append(p4NoteList, tools, tag("p", "tiny", "saved in this browser. super official."));

  add.addEventListener("click", addP4Note);
  p4NoteInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addP4Note();
  });

  drawP4Notes();
}

function setupFiles() {
  const body = document.querySelector("#win-files .win-body");  if (!body) return;

  const shelf = tag("div", "file-shelf");
  const stuff = [
    ["about", "desk map"],
    ["build", "active case"],
    ["music", "loop pile"],
    ["hoodies", "CASE 0"],
  ];

  body.textContent = "";
  p4FilePaper = tag("p", "", "pick a folder. pretend it has dust on it.");
  p4FilePaper.id = "file-paper";

  stuff.forEach(([name, label]) => {
    const btn = tag("button", "file-card", label);
    btn.type = "button";
    btn.dataset.file = name;
    btn.addEventListener("click", () => {
      if (name === "hoodies") {
        showP4Win(document.querySelector("#win-hoodies"));
        return;
      }

      p4FilePaper.textContent = p4Files[name];
    });
    shelf.append(btn);
  });

  body.append(shelf, p4FilePaper);
}

function setupHoodies() {
  const body = document.querySelector("#win-hoodies .win-body");  if (!body) return;

  const wall = tag("div", "hoodie-wall");

  body.textContent = "";
  body.classList.add("hoodie-case");
  body.append(
    tag("p", "case-stamp", "MISSING / CASE 0"),
    tag("p", "", "campfire flagship hoodies vanished from the swag shelf. no suspects yet. just these sad pics.")
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
  const body = document.querySelector("#win-shredder .win-body");  if (!body) return;

  const strips = tag("div", "paper-strips");

  body.textContent = "";
  body.classList.add("shredder-box");
  for (let i = 0; i < 5; i += 1) strips.append(tag("i"));

  body.append(
    tag("div", "shred-mouth"),
    tag("p", "", "evidence destroyed: 0"),
    tag("p", "tiny", "nobody has fed it yet. suspiciously clean."),
    strips
  );
}


setupNotebook();


setupFiles();


setupHoodies();
setupShredder();



