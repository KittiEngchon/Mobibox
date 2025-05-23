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

      const logo = document.createElement("img");
      logo.src = app.logo || "assets/default.png";
      logo.alt = app.name;
      logo.onerror = () => {
        logo.src = "assets/default.png";
      };

      const logoContainer = document.createElement("div");
      logoContainer.className = "app-logo";
      logoContainer.appendChild(logo);

      const title = document.createElement("h3");
      title.textContent = app.name;

      const desc = document.createElement("p");
      desc.textContent = app.description;

      const rating = document.createElement("span");
      rating.className = "rating";
      rating.textContent = `⭐ ${app.rating}`;

      const meta = document.createElement("div");
      meta.className = "app-meta";
      meta.appendChild(rating);

      const info = document.createElement("div");
      info.className = "app-info";
      info.appendChild(title);
      info.appendChild(desc);
      info.appendChild(meta);

      appCard.appendChild(logoContainer);
      appCard.appendChild(info);

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


