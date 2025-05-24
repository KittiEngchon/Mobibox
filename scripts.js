document.addEventListener("DOMContentLoaded", function () {
  let allApps = [];
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  let connectedAccount = null;

  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      allApps = data;
      allApps = sortByRank(allApps); // 🟢 จัดเรียงแร้งก่อน
      renderApps(allApps);
      setupFilters(allApps);
      setupSearch();
      setupThemeToggle();
      setupWalletConnect();
      setupChainSwitch();
      setupCategoryFilter();
      setupModalUI();
    })
    .catch((err) => console.error("Failed to load apps.json", err));

  if (window.ethereum) {
    window.ethereum.on("chainChanged", () => window.location.reload());
  }

  function renderApps(appList) {
    const appGrid = document.getElementById("appGrid");
    if (!appGrid) return;
    appGrid.innerHTML = "";

    appList.forEach((app, index) => {
      const appCard = document.createElement("div");
      appCard.className = "app-card";

      const logo = document.createElement("img");
      logo.src = "assets/default.png";
      logo.alt = app.name;

      const logoContainer = document.createElement("div");
      logoContainer.className = "app-logo";
      logoContainer.appendChild(logo);

      const title = document.createElement("h3");
      title.textContent = `#${index + 1} ${app.name}`; // 🟢 แสดงแร้ง

      const desc = document.createElement("p");
      desc.textContent = app.description;

      const rating = document.createElement("span");
      rating.className = "rating";
      rating.textContent = `⭐ ${app.rating}`;

      const shareBtn = document.createElement("button");
      shareBtn.textContent = "🔗";
      shareBtn.title = "Copy Share Link";
      shareBtn.onclick = () => {
        const url = `${window.location.origin}?app=${encodeURIComponent(app.name)}`;
        navigator.clipboard.writeText(url);
        showToast("🔗 Link copied!", true);
      };

      const favBtn = document.createElement("button");
      favBtn.textContent = favorites.includes(app.name) ? "❤️" : "🤍";
      favBtn.title = "Favorite";
      favBtn.onclick = () => {
        if (favorites.includes(app.name)) {
          favorites = favorites.filter(f => f !== app.name);
        } else {
          favorites.push(app.name);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderApps(appList);
        showToast("⭐ Favorite updated", true);
      };

      const meta = document.createElement("div");
      meta.className = "app-meta";
      meta.appendChild(rating);
      meta.appendChild(shareBtn);
      meta.appendChild(favBtn);

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

  // ... (ส่วนอื่นคงเดิม)

  function sortByRank(apps) {
    return apps.sort((a, b) => {
      const avgA = average(Object.values(a.segmentLevels || {}));
      const avgB = average(Object.values(b.segmentLevels || {}));
      const badgeScore = { "L0 Unverified": 0, L1: 1, L2: 2, "L3 Verified": 3, "L4 Elite": 4, "L5 Certified": 5 };
      const badgeA = badgeScore[a.badge] || 0;
      const badgeB = badgeScore[b.badge] || 0;
      return (b.rating * 2 + avgB + badgeB) - (a.rating * 2 + avgA + badgeA);
    });
  }

  // ... (ฟังก์ชันอื่นคงเดิม)
});


