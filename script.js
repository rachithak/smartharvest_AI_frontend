const leafInput = document.getElementById("leafInput");
const leafPreview = document.getElementById("leafPreview");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const uploadBox = document.querySelector(".upload-box");

function showPrediction(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    leafPreview.src = event.target.result;
    leafPreview.style.display = "block";
    previewPlaceholder.style.display = "none";
    // Demo-only result: this is not a real machine-learning diagnosis.
    const demoResults = [
      { name: "Healthy Leaf", confidence: 94.2, action: "The leaf looks healthy in this demo. Continue regular monitoring and balanced watering." },
      { name: "Leaf Blight", confidence: 96.4, action: "Remove badly affected leaves, avoid overhead watering and consult a local agricultural expert about suitable treatment." },
      { name: "Rust Disease", confidence: 91.8, action: "Check nearby plants for similar spots, improve airflow and seek locally approved treatment advice." }
    ];
    const result = demoResults[Math.floor(Math.random() * demoResults.length)];
    document.getElementById("diseaseName").textContent = result.name;
    document.getElementById("confidence").textContent = result.confidence.toFixed(1) + "%";
    document.getElementById("confidenceBar").style.width = result.confidence + "%";
    document.getElementById("diseaseAction").textContent = result.action;
    document.getElementById("predictionNote").textContent = "Demo result only — connect a trained image model for real disease detection.";
    const count = document.getElementById("scanCount");
    count.textContent = Number(count.textContent) + 1;
  };
  reader.readAsDataURL(file);
}
leafInput.addEventListener("change", (e) => showPrediction(e.target.files[0]));
["dragenter", "dragover"].forEach(type => uploadBox.addEventListener(type, e => {
  e.preventDefault(); uploadBox.classList.add("dragging");
}));
["dragleave", "drop"].forEach(type => uploadBox.addEventListener(type, e => {
  e.preventDefault(); uploadBox.classList.remove("dragging");
}));
uploadBox.addEventListener("drop", e => showPrediction(e.dataTransfer.files[0]));

document.getElementById("recommendBtn").addEventListener("click", () => {
  const moistureInput = document.getElementById("moisture");
  const crop = document.getElementById("crop").value;
  const moisture = Number(moistureInput.value);
  const output = document.getElementById("irrigationText");
  if (!Number.isFinite(moisture) || moisture < 0 || moisture > 100) {
    output.textContent = "Please enter a soil moisture value from 0 to 100.";
    moistureInput.focus();
    return;
  }
  let message;
  if (moisture < 25) message = `Soil moisture is very low for ${crop}. Irrigate soon, using a measured amount and checking the soil again afterward.`;
  else if (moisture < 40) message = `Your soil is slightly dry for ${crop}. Consider irrigating today or within 1 day.`;
  else if (moisture < 70) message = `Moisture looks moderate for ${crop}. Check the crop's growth stage and local weather before watering.`;
  else message = `Soil moisture is high for ${crop}. Delay irrigation and check drainage to avoid waterlogging.`;
  output.textContent = message;
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
  link.classList.add("active");
  document.getElementById("sidebar").classList.remove("open");
}));
