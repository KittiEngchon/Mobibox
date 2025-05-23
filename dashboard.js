document.addEventListener("DOMContentLoaded", function () {
  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      renderTopApps(data);
      renderBadgeSummary(data);
      renderBadgeChart(data);
      renderSegmentRadar(data);
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

  function renderBadgeChart(apps) {
    const summary = {};
    apps.forEach(app => {
      const badge = app.badge || "Unspecified";
      summary[badge] = (summary[badge] || 0) + 1;
    });

    const ctx = document.getElementById("badgeChart");
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(summary),
        datasets: [{
          label: "จำนวนแอปต่อระดับใบรับรอง",
          data: Object.values(summary),
          backgroundColor: "#61dafb",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "จำนวนแอป"
            }
          }
        }
      }
    });
  }

  function renderSegmentRadar(apps) {
    const topApp = apps.sort((a, b) => b.rating - a.rating)[0];
    if (!topApp || !topApp.segmentLevels) return;

    const ctx = document.createElement("canvas");
    ctx.id = "segmentChart";
    document.body.appendChild(ctx);

    const labels = ["Security", "Team", "Reputation", "Ecosystem", "Innovation"];
    const data = labels.map(key => topApp.segmentLevels[key.toLowerCase()] || 0);

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [{
          label: topApp.name,
          data: data,
          backgroundColor: "rgba(97,218,251,0.3)",
          borderColor: "#61dafb",
          pointBackgroundColor: "#61dafb"
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 5
          }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
});


