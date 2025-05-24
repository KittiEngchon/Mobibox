// ✅ Toast แจ้งเตือนลอยบนจอ
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}

// ✅ Modal พื้นฐาน (ใช้งานภายหลัง)
function showModal(title, contentHTML) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h2>${title}</h2>
      <div class="modal-content">${contentHTML}</div>
      <button onclick="this.parentElement.parentElement.remove()">ปิด</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ✅ Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// ✅ โหลดธีมล่าสุดจาก localStorage
function loadTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}
// ---------- Toast Notification ----------
function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ---------- Modal ----------
function showModal(title, content, onClose = null) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      <h2>${title}</h2>
      <div class="modal-content">${content}</div>
      <button class="modal-close">ปิด</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    if (onClose) onClose();
  };
}

// ---------- Theme Toggle ----------
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark-theme");
}

// ✅ เรียกเมื่อเริ่มต้นหน้า
window.addEventListener('DOMContentLoaded', loadTheme);
