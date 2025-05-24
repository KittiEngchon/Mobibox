document.addEventListener("DOMContentLoaded", function () {
  let allApps = [];
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  let connectedAccount = null;

  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      allApps = sortByRank(data);
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
      title.textContent = `#${index + 1} ${app.name}`;

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
        renderApps(allApps); // ✅ ใช้ allApps ที่จัด rank แล้ว
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

  // ... (ฟังก์ชันอื่นเหมือนเดิม ไม่เปลี่ยนแปลง)

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

  function average(arr) {
    return arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
  }

  function shorten(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  function getNetworkName(chainId) {
    switch (chainId) {
      case "0x1": return "Ethereum";
      case "0x89": return "Polygon";
      case "0x38": return "BSC";
      default: return `Unknown (${parseInt(chainId, 16)})`;
    }
  }
});



