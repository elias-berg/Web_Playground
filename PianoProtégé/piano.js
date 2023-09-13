class PianoKey {
  constructor(x, y, w, h, isBlack, note) {
    this.X = x;
    this.Y = y;
    this.W = w;
    this.H = h;
    this.IsBlack = !!isBlack;
    this.Fill = this.IsBlack ? "black" : "white";
    const audioFileName = encodeURIComponent("assets/sounds/" + note + ".mp3");
    this.Audio = new Audio(audioFileName);
  }

  pointInKey = (x, y) => {
    if (x < this.X) return false;
    if (y < this.Y) return false;
    if (x > this.X + this.W) return false;
    if (y > this.Y + this.H) return false;
    return true;
  }

  setDown = (isDown) => {
    if (isDown) {
      this.Fill = "gray";
      this.Audio.play();
    } else {
      this.Fill = this.IsBlack ? "black" : "white";
      this.Audio.pause();
      this.Audio.currentTime = 0;
    }
  }

  paintKey = (context) => {
    context.strokeStyle = "black";
    context.fillStyle = this.Fill;
    context.fillRect(this.X, this.Y, this.W, this.H);
    context.strokeRect(this.X, this.Y, this.W, this.H);
  }
}

const paintAll = (keys, pianoCtx) => {
  for (let key of keys) {
    key.paintKey(pianoCtx);
  }
}

// Separate collection of black keys and white keys to make it easier
// to detect which is being pressed; since the black overlap the white,
// we can check them first, and short-circuit the checking.
let whiteKeys = [];
let blackKeys = [];
let pressedKey = null;

const notes = ["c", "d", "e", "f", "g", "a", "b"];

const piano = document.getElementById("piano");
const pianoCtx = piano.getContext("2d");

const paintPiano = () => {
  whiteKeys = [];
  blackKeys = [];

  const container = document.getElementById("bottom");
  piano.width = container.offsetWidth;
  piano.height = container.offsetHeight;
  
  const width = piano.width - 1;
  const height = piano.height - 1;
  
  // The body of the piano
  pianoCtx.lineWidth = 2.5;
  
  // Now for each white key (C, D, E, F, G, A, and B)
  const keyW = (width / 7) - 1;
  for (let i = 0; i < 7; i++) {
    const k = new PianoKey((keyW * i) + 1, 1, keyW, height - 1, false, notes[i] + "4");
    whiteKeys.push(k);
  }
  
  // Now for the black keys (C#, D#, F#, G#, and A#)
  const midW = (keyW / 3) * 2;
  for (let i = 0; i < 6; i++) {
    if (i === 2) continue;
    const k = new PianoKey(midW + (keyW * i) + (keyW / 6), 1, keyW / 3, height * 0.75, true, notes[i] + "#4");
    blackKeys.push(k);
  }
  
  paintAll(whiteKeys, pianoCtx);
  paintAll(blackKeys, pianoCtx);
}

window.addEventListener("resize", () => {
  paintPiano();
})

piano.addEventListener("pointerdown", (event) => {
  console.log(event.offsetX + "," + event.offsetY);
  pressedKey = null;
  for (const key of blackKeys) {
    if (key.pointInKey(event.offsetX, event.offsetY)) {
      pressedKey = key;
      break;
    }
  }
  if (!pressedKey) {
    for (const key of whiteKeys) {
      if (key.pointInKey(event.offsetX, event.offsetY)) {
        pressedKey = key;
        break;
      }
    }
  }
  if (!pressedKey) return;
  pressedKey.setDown(true);
  paintAll(whiteKeys, pianoCtx);
  paintAll(blackKeys, pianoCtx);
});

piano.addEventListener("pointerup", (event) => {
  pressedKey.setDown(false);
  pressedKey = null;
  paintAll(whiteKeys, pianoCtx);
  paintAll(blackKeys, pianoCtx);
});

// Script Start
paintPiano();