const exportBtn = document.getElementById("exportBtn");

let addedApps = []; // mock storage (in-memory)

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const newApp = {
    name: formData.get("name"),
    description: formData.get("description"),
    logo: formData.get("logo"),
    rating: parseFloat(formData.get("rating")),
    badge: formData.get("badge"),
    segmentLevels: {}
  };

  try {
    newApp.segmentLevels = JSON.parse(formData.get("segmentLevels"));
  } catch {
    status.textContent = "❌ segmentLevels JSON format ไม่ถูกต้อง";
    status.style.color = "red";
    return;
  }

  addedApps.push(newApp);
  status.textContent = "✅ เพิ่มแอปแล้ว (mock only)";
  status.style.color = "green";
  form.reset();
});

// ✅ Export JSON
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(addedApps, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "apps.json";
  a.click();
  URL.revokeObjectURL(url);
});

