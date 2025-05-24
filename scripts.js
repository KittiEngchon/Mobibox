document.addEventListener("DOMContentLoaded", function () {
  let allApps = [];

  fetch("apps.json")
    .then((res) => res.json())
    .then((data) => {
      allApps = data;
      renderApps(data);
      setupFilters(data);
      setupSearch();
      setupThemeToggle();
      setupWalletConnect();
      setupChainSwitch();
      setupCategoryFilter();
    })
    .catch((err) => {
      console.error("Failed to load apps.json", err);
    });

  if (window.ethereum) {
    // หากเปลี่ยน Chain → reload หน้าเพื่อ sync ใหม่
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }

  function renderApps(appList) {
    const appGrid = document.getElementById("appGrid");
    if (!appGrid) return;

    appGrid.innerHTML = "";
    const sortedApps = sortByRank(appList);

    sortedApps.forEach((app) => {
      const appCard = document.createElement("div");
      appCard.className = "app-card";

      const logo = document.createElement("img");
      logo.src = "assets/default.png"; // ❌ ไม่โหลดจาก app.logo
      logo.alt = app.name;

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

      const shareBtn = document.createElement("button");
      shareBtn.textContent = "🔗";
      shareBtn.title = "Copy Share Link";
      shareBtn.onclick = () => {
        const url = `${window.location.origin}?app=${encodeURIComponent(app.name)}`;
        navigator.clipboard.writeText(url);
        alert("🔗 Link copied!");
      };

      const meta = document.createElement("div");
      meta.className = "app-meta";
      meta.appendChild(rating);
      meta.appendChild(shareBtn);

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

  function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      const filtered = allApps.filter(app =>
        app.name.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword)
      );
      renderApps(filtered);
    });
  }

  function setupThemeToggle() {
    const toggleBtn = document.getElementById("themeToggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }

  function setupWalletConnect() {
    const btn = document.getElementById("connectWalletBtn");
    const display = document.getElementById("walletAddress");

    if (!window.ethereum || !btn) {
      btn.disabled = true;
      btn.textContent = "No Wallet";
      return;
    }

    btn.addEventListener("click", async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const wallet = accounts[0];
        const chainId = await window.ethereum.request({ method: "eth_chainId" });

        display.textContent = `${shorten(wallet)} | Chain: ${getNetworkName(chainId)}`;
        btn.textContent = "✅ Connected";

        if (chainId !== "0x89") {
          alert("⚠️ กรุณาเปลี่ยนเป็น Polygon (137)");
        }
      } catch (err) {
        console.error("Wallet connect error:", err);
        alert("❌ Failed to connect wallet");
      }
    });
  }

  function setupChainSwitch() {
    const btn = document.getElementById("switchChainBtn");
    if (!window.ethereum || !btn) return;

    btn.addEventListener("click", async () => {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }] // Polygon Mainnet
        });
        alert("✅ Switched to Polygon");
      } catch (err) {
        alert("❌ Failed to switch chain");
      }
    });
  }

  function setupCategoryFilter() {
    const menu = document.querySelector(".category-menu");
    if (!menu) return;

    menu.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") return;

      document.querySelectorAll(".category-menu button").forEach(btn =>
        btn.classList.remove("active")
      );
      e.target.classList.add("active");

      const category = e.target.dataset.category;
      let filtered = allApps;

      if (category !== "All") {
        filtered = allApps.filter(app =>
          (app.category || "").toLowerCase() === category.toLowerCase()
        );
      }

      renderApps(filtered);
    });
  }

  function sortByRank(apps) {
    return apps.sort((a, b) => {
      const avgSegmentA = average(Object.values(a.segmentLevels || {}));
      const avgSegmentB = average(Object.values(b.segmentLevels || {}));
      const badgeScore = {
        "L0 Unverified": 0,
        "L1": 1,
        "L2": 2,
        "L3 Verified": 3,
        "L4 Elite": 4,
        "L5 Certified": 5
      };
      const badgeA = badgeScore[a.badge] || 0;
      const badgeB = badgeScore[b.badge] || 0;

      const scoreA = (a.rating || 0) * 2 + avgSegmentA + badgeA;
      const scoreB = (b.rating || 0) * 2 + avgSegmentB + badgeB;
      return scoreB - scoreA;
    });
  }

  function average(arr) {
    if (!arr.length) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
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
