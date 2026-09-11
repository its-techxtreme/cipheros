# CipherOS

A detective corkboard in a browser tab. Polaroids on the left, manila folders on the cork, dull red yarn between them, masking tape across the top, a wood strip at the bottom. HTML, CSS, and JavaScript. No frameworks, no build, no npm. sooo simple on paper.

Live desk: https://cipheros.techxtreme.me

Backup if DNS is being wierd: https://cipheros-ten.vercel.app :)

![desk](shots/desk.png)

## Run it on your computer

You need a browser. A tiny local server is the relible way to load the css and js. Python 3 is enough okayyy. You do not install packages for this repo.

```
git clone https://github.com/its-techxtreme/cipheros.git
cd cipheros
```

Then start a server in that folder likeee.

On Windows (whichever one works on your machine):

```
python -m http.server 8000
```

or

```
py -m http.server 8000
```

On Mac or Linux:

```
python3 -m http.server 8000
```

Open http://127.0.0.1:8000 in the browser yesss :D. Leave the terminal running while you use the desk. Ctrl+C stops the server.

If Python is not installed, Node can serve the same folder:

```
npx --yes serve . -p 8000
```

Double-clicking `index.html` sometimes works waittt. If you get a naked page with no cork and no folders, use the server instead. That is the usual "I opened the file and it looks broken" fix.

You do not need an account. There is nooo password wall +_+

## How you use the desk

Welcome is open when you land ywahhh. Click **CipherOS** on the tape if you closed it and want it back.

The polaroids and the shredder sticky on the left open folders. One click is enough rlyyy.

Folders drag from the tab, the brown strip with the title hmmmm. Grabbing the paper does not move them. Click a folder to pull it in front. The scribbly **x** closes it. There is no minimize, no maximize, no resize handle.

Dull red yarn runs from each pin to its folder prettyyy. Close a folder and a leftover tack stays where the tab was. The string still hangs there. Open it again and the yarn snaps back to the tab.

The clock on the tape is a button actuallyyy. It opens a little **watch** folder. The wood chips along the bottom follow whichever folder is in front.

Yarn was the thing that ate a weekend damnmm ;-}. I thought pin-to-folder would be two coordiantes and a line. Then the board resized, folders sat on `right`/`bottom` instead of `left`/`top`, and the shredder jumped across the cork the first time you dragged it. I tried straight lines, then they looked like a diagram. The saggy quadratic path is what survived after I threw the first version out. Closing a folder used to kill the string entirely, which looked cheap, so leftover tacks are me being stubborn about that.

## What's on it

**The board** is the page lowkeyyy. Cork grain, pinholes, a lamp in the corner, darker edges. The tape bar is masking tape with **CipherOS**, **EVIDENCE DESK**, and the clock. The bottom strip is wood grain, not another piece of cork.

Type is split on purpose frrr. Tape titles are Georgia. The stamp on the tape (EVIDENCE DESK, the clock) is bold Arial. Paper inside folders is Courier New.

**notebook** is lined paper. Type a clue, hit Enter or **pin note**. Scratch deletes a line. Notes save in this browser under `cipheros-notes` in localStorage, so a refresh definately keeps them pleaseee. Clearing site data wipes them.

**files** is a seperate shelf of cards: desk map, active case, loop pile, CASE 0. The first three drop a blurb on the paper. CASE 0 opens the hoodie folder.

**hoodies** is CASE 0. Three Campfire Flagship Hoodies went missing from the swag shelf, sizes L, M, and S. No shop photos, so you get silouettes with a question mark brooo o_O. The story is still sitting on the board. You can look, you cannot solve it yet.

**shredder** sits bottom-right. Evidence destroyed: 0. Empty on purpose goood. It has not eaten anything.

**watch** is the tape clock in a folder idkkk. Seconds tick on the face. Same time as the tape.

![folders](shots/folders.png)

## Files in the repo

```
index.html   the desk: tape, pins, folders, yarn paths, wood strip
style.css    cork, tape, wood, folders, polaroids, yarn, apps
os.js        pins, drag, close, leftover tacks, yarn, clock, dock
apps.js      notebook, files, CASE 0, shredder, watch guts
store.js     tiny localStorage helpers, then loads os.js and apps.js
shots/       pictures for this readme
LICENSE      MIT
```

That is the whole product anywayyy. Open those files if you want to change copy or colors. Palette lives at the top of `style.css`.

MIT, see LICENSE. recieve the files and go.
