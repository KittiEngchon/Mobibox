document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addAppForm");
  const status = document.getElementById("adminStatus");

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
      const rawSegment = formData.get("segmentLevels");
      newApp.segmentLevels = JSON.parse(rawSegment);
    } catch {
      status.textContent = "❌ segmentLevels JSON format ไม่ถูกต้อง";
      status.style.color = "red";
      return;
    }

    // Mock save: แสดงใน console
    console.log("📦 แอปใหม่ที่เพิ่ม:", newApp);
    status.textContent = "✅ เพิ่มแอปเสร็จสมบูรณ์ (mock only)";
    status.style.color = "green";

    // Reset form
    form.reset();
  });
});
