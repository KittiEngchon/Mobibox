fetch('apps.json')
  .then(res => res.json())
  .then(apps => {
    const appList = document.getElementById('appList');
    const filterRating = document.getElementById('filter-rating');
    const filterSegment = document.getElementById('filter-segment');

    function renderApps() {
      const ratingVal = parseInt(filterRating.value || 0);
      const segment = filterSegment.value;

      appList.innerHTML = '';
      apps.forEach(app => {
        if (ratingVal && app.rating !== ratingVal) return;
        if (segment && app.badges[segment] === 'unverified') return;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow p-4 app-card';
        card.innerHTML = `
          <h2 class="text-lg font-semibold">${app.name}</h2>
          <div class="text-sm text-gray-500">${app.type}</div>
          <div class="text-yellow-500">${'⭐'.repeat(app.rating)}${'☆'.repeat(5 - app.rating)}</div>
          <div class="mt-2 space-y-1 text-sm">
            ${Object.entries(app.badges).map(([k,v]) => {
              const labels = {
                security: "🔒 Security",
                team: "👥 Team",
                users: "👑 Users",
                ecosystem: "🌐 Ecosystem",
                innovation: "⚙️ Innovation"
              };
              const icons = {
                "unverified": "💩",
                "registered": "🟠",
                "verified": "🟡",
                "trusted": "🔵",
                "gold-certified": "👑"
              };
              return `<div class="badge">${icons[v]} ${labels[k]}</div>`;
            }).join('')}
          </div>
          <div class="mt-2 text-sm text-blue-600 flex justify-between">
            <a href="${app.url}" target="_blank">🔗 Visit</a>
            <a href="#">❤️ Favorite</a>
            <a href="#">📤 Share</a>
            <a href="#">🔳 QR</a>
          </div>
        `;
        appList.appendChild(card);
      });
    }

    filterRating.addEventListener('change', renderApps);
    filterSegment.addEventListener('change', renderApps);
    renderApps();
  });
