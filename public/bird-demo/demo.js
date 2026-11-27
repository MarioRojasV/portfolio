/* Bird classifier demo: runs entirely in the browser with TensorFlow.js.
 * The photo never leaves the visitor's device.
 *
 * Model: MobileNetV2 (transfer learning), converted to a TF.js graph model.
 * Classes (index order = alphabetical folder order used in training):
 *   0 = Quiscalus_mexicanus_female, 1 = Turdus_grayi
 */

const IMG_SIZE = 224;
const LOW_CONFIDENCE = 0.65; // below this, the page warns that the result is uncertain
const MAX_SIDE = 2000; // very large phone photos are downscaled before processing
const MODEL_URL = "model/model.json";

const CLASS_LABELS = [
  "Quiscalus mexicanus, female (Great-tailed Grackle)",
  "Turdus grayi (Clay-colored Thrush)",
];

// Add your example photos here (put the files in the examples/ folder).
const EXAMPLES = [
  { src: "examples/q_mexicanus_1.jpg", caption: "Regular photo" },
  { src: "examples/q_mexicanus_2.jpg", caption: "Regular photo" },
  { src: "examples/q_mexicanus_flying_1.jpg", caption: "In flight" },
  { src: "examples/t_grayi_1.jpg", caption: "Regular photo" },
  { src: "examples/t_grayi_2.jpg", caption: "Regular photo" },
  { src: "examples/t_grayi_flying_1.jpg", caption: "In flight" },
  { src: "examples/t_grayi_flying_2.jpg", caption: "In flight" },
];

/* Replicates the training pipeline exactly:
 *   tf.image.resize_with_pad(img, 224, 224)   (bilinear, centered, zero padding)
 *   mobilenet_v2.preprocess_input              (x / 127.5 - 1)
 * `img` is an HxWx3 float32 tensor with pixel values in [0, 255]. */
function preprocess(tf, img, target = IMG_SIZE) {
  return tf.tidy(() => {
    const [h, w] = img.shape;
    const ratio = Math.max(w / target, h / target);
    const rh = Math.floor(h / ratio);
    const rw = Math.floor(w / ratio);
    const padTop = Math.max(0, Math.floor((target - h / ratio) / 2));
    const padLeft = Math.max(0, Math.floor((target - w / ratio) / 2));
    const resized = tf.image.resizeBilinear(img, [rh, rw], false, true); // half-pixel centers, like TF2
    const padded = resized.pad(
      [[padTop, target - rh - padTop], [padLeft, target - rw - padLeft], [0, 0]],
      0
    );
    return padded.div(127.5).sub(1).expandDims(0);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { preprocess, CLASS_LABELS, LOW_CONFIDENCE };
}

/* ---------------------------- Browser UI ---------------------------- */

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", init);
}

let model = null;
let currentUrl = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(message, kind) {
  const el = $("status");
  el.textContent = message;
  el.className = "status" + (kind ? " " + kind : "");
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadModel() {
  setStatus("Loading model…");
  try {
    await tf.ready();
    model = await tf.loadGraphModel(MODEL_URL);
    // Warm-up run so the first real prediction is fast.
    const warm = model.predict(tf.zeros([1, IMG_SIZE, IMG_SIZE, 3]));
    await warm.data();
    warm.dispose();
    setStatus("Model ready. Upload a photo to classify it.", "ok");
  } catch (err) {
    console.error(err);
    setStatus(
      "Could not load the model. Check that the model/ folder contains model.json and its .bin files.",
      "error"
    );
  }
}

async function classify(imageEl) {
  const scale = Math.min(1, MAX_SIDE / Math.max(imageEl.naturalWidth, imageEl.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(imageEl.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(imageEl.naturalHeight * scale));
  canvas.getContext("2d").drawImage(imageEl, 0, 0, canvas.width, canvas.height);

  const output = tf.tidy(() => {
    const pixels = tf.cast(tf.browser.fromPixels(canvas, 3), "float32");
    return model.predict(preprocess(tf, pixels));
  });
  const probs = Array.from(await output.data());
  output.dispose();
  return probs;
}

function showResult(probs, url) {
  $("preview").src = url;
  $("result").hidden = false;

  const best = probs[0] >= probs[1] ? 0 : 1;
  $("verdict").textContent =
    "Prediction: " + CLASS_LABELS[best] + " (" + (probs[best] * 100).toFixed(1) + "%)";
  $("warn").hidden = probs[best] >= LOW_CONFIDENCE;

  const bars = $("bars");
  bars.textContent = "";
  probs.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = CLASS_LABELS[i];

    const track = document.createElement("div");
    track.className = "bar";
    const fill = document.createElement("div");
    fill.className = "bar-fill" + (i === best ? " best" : "");
    fill.style.width = (p * 100).toFixed(1) + "%";
    track.appendChild(fill);

    const pct = document.createElement("div");
    pct.className = "bar-pct";
    pct.textContent = (p * 100).toFixed(1) + "%";

    row.append(label, track, pct);
    bars.appendChild(row);
  });
}

async function classifyFromUrl(url, isObjectUrl) {
  if (!model) {
    setStatus("The model is not ready yet. Try again in a moment.", "error");
    return;
  }
  setStatus("Classifying…");
  try {
    const img = await loadImage(url);
    const probs = await classify(img);
    if (currentUrl && currentUrl !== url && currentUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentUrl);
    }
    currentUrl = isObjectUrl ? url : null;
    showResult(probs, url);
    setStatus("Done. Try another photo.", "ok");
  } catch (err) {
    console.error(err);
    setStatus("Could not process that image. Try a JPG or PNG.", "error");
  }
}

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setStatus("Please choose an image file (JPG or PNG).", "error");
    return;
  }
  classifyFromUrl(URL.createObjectURL(file), true);
}

function renderExamples() {
  if (EXAMPLES.length === 0) return;
  const box = $("examples");
  box.hidden = false;
  const list = $("example-list");
  EXAMPLES.forEach((ex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "example";
    const img = document.createElement("img");
    img.src = ex.src;
    img.alt = ex.caption;
    const cap = document.createElement("span");
    cap.textContent = ex.caption;
    btn.append(img, cap);
    btn.addEventListener("click", () => classifyFromUrl(ex.src, false));
    list.appendChild(btn);
  });
}

function init() {
  const input = $("file");
  const drop = $("drop");

  input.addEventListener("change", () => {
    handleFile(input.files[0]);
    input.value = ""; // allow selecting the same file again
  });

  ["dragenter", "dragover"].forEach((evt) =>
    drop.addEventListener(evt, (e) => {
      e.preventDefault();
      drop.classList.add("over");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    drop.addEventListener(evt, (e) => {
      e.preventDefault();
      drop.classList.remove("over");
    })
  );
  drop.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

  renderExamples();
  loadModel();
}
