// Constants/HTML Elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const model = document.getElementById("model");
const modelCtx = model.getContext("2d");
let modelData = []; // The set of average pixels to conver to lego colors

const wRange = document.getElementById("wRange");
const hRange = document.getElementById("hRange");
const dimens = document.getElementById("dimensions");

// black, blue-gray, brown, green, light green, dark green, sky?, white
const palette = [0x000000, 0x666699, 0x996633, 0x009933, 0x00cc00, 0x003300, 0x0099ff, 0xffffff];
let brickData = [];

let debounce = null;

const getAveragePixelColor = (x, y, w, h) => {
  const pixels = [];
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      pixels.push(ctx.getImageData(i, j, 1, 1).data);
    }
  }

  let avg = [0, 0, 0];
  pixels.forEach((data) => {
    avg[0] += data[0];
    avg[1] += data[1];
    avg[2] += data[2];
  });
  const len = pixels.length;
  avg = avg.map((val) => val / len);
  modelData[modelData.length - 1].push(avg); // modelData Update Pt 3 -----
  return `rgb(${avg[0]}, ${avg[1]}, ${avg[2]})`;
};

const updateDimensions = (w, h) => {
  debounce = null; // Clear debouncer
  modelData = []; // modelData Update Pt 1 --------------------------------
  brickData = [];

  // Clear the image
  modelCtx.fillStyle = "white";
  modelCtx.fillRect(0, 0, model.width, model.height);

  const wPixels = Math.floor(500 / w);
  const hPixels = Math.floor(500 / h);
  for (let r = 0; r < 500 / wPixels; r++) {
    modelData.push([]); // modelData Update Pt 2 --------------------------
    for (let c = 0; c < 500 / hPixels; c++) {
      //modelCtx.fillStyle = ["red", "green", "blue"].at((Math.random() * 7) % 3); // Random for testing funsies
      let x = r * wPixels;
      let y = c * hPixels;
      modelCtx.fillStyle = getAveragePixelColor(x, y, wPixels, hPixels);
      modelCtx.fillRect(r * wPixels, c * hPixels, wPixels, hPixels);
    }
  }

  for (let r = 0; r < modelData.length; r++) {
    brickData.push([]);
    for (let c = 0; c < modelData[0].length; c++) {
      let color = modelData[r][c];

      // TODO
    }
  }
};

wRange.addEventListener("input", (e) => {
  const w = +e.target.value;
  const h = +hRange.value;
  dimens.innerText = w + ", " + h;
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => updateDimensions(w, h), 250);
});

hRange.addEventListener("input", (e) => {
  const w = +wRange.value;
  const h = +e.target.value;
  dimens.innerText = w + ", " + h;
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => updateDimensions(w, h), 250);
});

// TODO: Replace this chunk with an image uploader
const img = new Image();
img.crossOrigin = "anonymous";
img.src = "assets/fox.jpeg";

img.addEventListener("load", () => {
  let wScale = canvas.width / img.naturalWidth;
  let hScale = canvas.height / img.naturalHeight;
  let width = img.naturalWidth * wScale;
  let height = img.naturalHeight * hScale;
  let x = canvas.width / 2 - width / 2;
  let y = canvas.height / 2 - height / 2;
  ctx.drawImage(img, x, y, width, height);
  img.style.display = "none"; // Hide the image from displaying outside of the ctx

  // Set range maxes, too
  wRange.max = 500;
  hRange.max = 500;
  dimens.innerText = +wRange.value + ", " + +hRange.value;
  // Pop the update off the stack so the user can start interacting
  setTimeout(() => updateDimensions(+wRange.value, +hRange.value), 0);
});
