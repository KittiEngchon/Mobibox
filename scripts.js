document.addEventListener("DOMContentLoaded", function () {
  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      renderApps(data);
      setupFilters(data);
    })
    .catch((err) => {
      console.error("Failed to load apps.json", err);
    });

  function renderApps(appList) {
    const appGrid = document.getElementById("appGrid");
    if (!appGrid) return;

    appGrid.innerHTML = "";
    appList.forEach((app) => {
      const appCard = document.createElement("div");
      appCard.className = "app-card";

      appCard.innerHTML = `
        <div class="app-logo">
          <img src="${app.logo || 'assets/default.png'}" alt="${app.name}" onerror="this.src='assets/default.png';" />
        </div>
        <div class="app-info">
          <h3>${app.name}</h3>
          <p>${app.description}</p>
          <div class="app-meta">
            <span class="rating">⭐ ${app.rating}</span>
          </div>
        </div>
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

