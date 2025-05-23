document.addEventListener("DOMContentLoaded", function () {
  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      renderApps(data);
      setupFilters(data);
    });

  function renderApps(appList) {
    const appGrid = document.getElementById("appGrid");
    if (!appGrid) return; // 🔐 ป้องกัน crash

    appGrid.innerHTML = "";
    appList.forEach((app) => {
      const appCard = document.createElement("div");
      appCard.className = "app-card";
      appCard.innerHTML = `
        <h3>${app.name}</h3>
        <p>${app.description}</p>
        <p>⭐ ${app.rating}</p>
      `;
      appGrid.appendChild(appCard);
    });
  }

  function setupFilters(appList) {
    const filter = document.getElementById("filterStars");
    if (!filter) return;

    filter.addEventListener("change", () => {
      const threshold = parseInt(filter.value);
      const filtered = appList.filter(app => app.rating >= threshold);
      renderApps(filtered);
    });
  }
});

