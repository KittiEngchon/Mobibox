document.addEventListener("DOMContentLoaded", function () {
  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      renderTopApps(data);
      renderBadgeSummary(data);
    });

  function renderTopApps(apps) {
    const topApps = apps
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const container = document.getElementById("topApps");
    if (!container) return;

    container.innerHTML = "";
    topApps.forEach(app => {
      const card = document.createElement("div");
      card.className = "app-card";
      card.innerHTML = `
        <h3>${app.name}</h3>
        <p>${app.description}</p>
        <span class="rating">⭐ ${app.rating}</span>
      `;
      container.appendChild(card);
    });
  }

  function renderBadgeSummary(apps) {
    const summary = {};
    apps.forEach(app => {
      const badge = app.badge || "Unspecified";
      summary[badge] = (summary[badge] || 0) + 1;
    });

    const container = document.getElementById("badgeSummary");
    if (!container) return;

    container.innerHTML = "<ul>" + Object.entries(summary).map(
      ([badge, count]) => `<li>${badge}: ${count} apps</li>`
    ).join("") + "</ul>";
  }
});
