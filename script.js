document.addEventListener("DOMContentLoaded", () => {
  const appGrid = document.getElementById("appGrid");
  const filterStars = document.getElementById("filterStars");

  let apps = [];
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  fetch("apps.json")
    .then(res => res.json())
    .then(data => {
      apps = data;
      renderApps(apps);
    });

  function renderApps(appList) {
    appGrid.innerHTML = "";

    appList.forEach(app => {
      const card = document.createElement("div");
      card.className = "app-card";

      const isFavorite = favorites.includes(app.name);

      card.innerHTML = `
        <div class="card-actions">
          <button onclick="toggleFavorite('${app.name}')">
            ${isFavorite ? "❤️" : "🤍"}
          </button>
          <button onclick="shareApp('${app.name}')">🔗</button>
        </div>
        <img src="${app.icon}" alt="${app.name}" />
        <h2>${app.name}</h2>
        <div class="description">${app.description}</div>
        <div class="rating">${"⭐".repeat(Math.round(app.rating))}</div>
        <div class="badges">
          ${app.badges.map(b => `<span class="badge">${b}</span>`).join("")}
        </div>
        <div class="certifications">
          ${renderCertifications(app.certifications)}
        </div>
      `;

      appGrid.appendChild(card);
    });
  }

  function renderCertifications(cert) {
    const levels = ["💩", "🥉", "🥈", "🥇", "🏆"];
    const icons = {
      security: "🛡️",
      team: "🧑‍💼",
      reputation: "💬",
      ecosystem: "🌐",
      innovation: "🚀"
    };

    return Object.keys(cert).map(type => {
      const level = cert[type];
      return `<span class="cert-icon" title="${type}: ${level}">${icons[type]}${levels[level]}</span>`;
    }).join(" ");
  }

  window.toggleFavorite = function(name) {
    const index = favorites.indexOf(name);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(name);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderApps(apps);
  };

  window.shareApp = function(name) {
    const url = `${window.location.href.split("?")[0]}?app=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    alert(`📎 Copied share link for ${name}`);
  };

  filterStars?.addEventListener("change", e => {
    const star = parseInt(e.target.value);
    const filtered = apps.filter(a => Math.floor(a.rating) >= star);
    renderApps(filtered);
  });
});
