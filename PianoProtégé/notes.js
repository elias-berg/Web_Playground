class StaffBar {
  constructor(x, y, w, h) {
    this.X = x;
    this.Y = y;
    this.W = w;
    this.H = h;
    this.MidX = this.X + (this.W / 2);
    this.MixY = this.Y + (this.H / 2);
  }
}

// Working around the lack of enumerations
const NoteType = {
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  A: "A",
  B: "B",
}
const NoteLetters = ["C", "D", "E", "F", "G", "A", "B"];

class Note {
  constructor(staffBars, noteType) {
    this.X = staffBars.Elem.width;
    this.Radius = staffBars.BarHeight / 3;

    this.ParentStaff = staffBars;
    this.NoteType = noteType;
    this.Y = this.noteTypeToPosition();
  }

  /**
   * TODO: Make this iterative and not a "Switch"
   * @returns The relative position of the staff bars
   */
  noteTypeToPosition = () => {
    const bars = this.ParentStaff.Bars;
    const barHeight = this.ParentStaff.BarHeight;
    const halfHeight = barHeight / 2;
    switch (this.NoteType) {
      case NoteType.C:
        return bars[4].Y + barHeight; // One full height below the bar
      case NoteType.D:
        return bars[4].Y + halfHeight;
      case NoteType.E:
        return bars[4].Y;
      case NoteType.F:
        return bars[4].Y - halfHeight;
      case NoteType.G:
        return bars[3].Y;
      case NoteType.A:
        return bars[3].Y - halfHeight;
      case NoteType.B:
        return bars[2].Y;
      default:
        return 120;
    }
  }

  move = (val) => {
    this.X -= val;
  }

  draw = (staffCtx) => {
    staffCtx.beginPath();
    staffCtx.arc(this.X, this.Y, this.Radius, 0, 2 * Math.PI, false);
    staffCtx.fill();
    // Now the stem!
    const width = 5;
    const height = 50;
    staffCtx.fillRect(this.X + this.Radius - width, this.Y - height, width, height)
  }
}

class Staff {
  constructor() {
    this.Notes = [];
    this.Bars = [];
    this.Counter = 0;

    this.Elem = document.getElementById("staff");
    this.Ctx = this.Elem.getContext("2d");

    window.addEventListener("resize", () => {
      this.calcStaff();
      this.paintStaff();
    });

    setInterval(() => {
      // Redraw each frame
      this.Ctx.clearRect(0, 0, this.Elem.width, this.Elem.height);
      this.paintStaff();

      // Create a new note
      if (this.Counter % 40 === 0) { // TODO: moving interval
        this.Counter = 0;
        const newNote = new Note(this, this.randomNote()); // TODO
        this.Notes.push(newNote);
      }

      const newNotes = [];
      for (let note of this.Notes) {
        note.move(10);
        if (note.X < 0) {
          continue;
        }
        note.draw(this.Ctx);
        newNotes.push(note);
      }
      this.Notes = newNotes;

      this.Counter++;
    }, 25);

    // Now create the damn thing
    this.calcStaff();
    this.paintStaff();
  }

  // TODO: calculate the new positions of all the notes, too
  calcStaff = () => {
    this.Bars = [];

    const container = document.getElementById("top");
    this.Elem.width = container.offsetWidth;
    this.Elem.height = container.offsetHeight;
    
    const width = this.Elem.width;
    const height = this.Elem.height;

    // Draw the bars...
    // We want a 20% margin above and below the bars, so we divide the
    // screen into 5
    const denom = 5; // Fraction denominator; how many pieces to split the screen into
    const margin = this.Elem.height / denom;
    // Then we need 5 bars, so we take 3/5 of the screen and divide that into 5
    const bars = 5;
    this.BarHeight = (margin * (denom - 2)) / bars;
    for (let i = 0; i < bars; i++) {
      const newBar = new StaffBar(0, margin + (i * this.BarHeight), this.Elem.width, 5);
      this.Bars.push(newBar);
    }
  };

  // TODO: repaint all of the current notes, too
  paintStaff = () => {
    this.Ctx.lineWidth = 4.5;
    this.Ctx.fillStyle = "black";
    for (let bar of this.Bars) {
      this.Ctx.fillRect(bar.X, bar.Y, bar.W, bar.H);
    }
    this.Ctx.fillRect(0, this.Bars[0].Y, 10, this.Bars[4].Y - this.Bars[0].Y);
  }

  // TODO: Replace this eventually
  randomNote = () => {
    const rand = Math.floor(Math.random() * 15) % 7;
    console.log(NoteLetters[rand]);
    return NoteLetters[rand];
  }
};

// Script start
const s = new Staff();