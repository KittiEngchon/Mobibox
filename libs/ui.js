// libs/ui.js

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
window.addEventListener('DOMContentLoaded', applySavedTheme);

// ---------- Toast CSS ----------
const style = document.createElement('style');
style.textContent = `
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  animation: fadeInOut 3s ease-in-out;
}
.toast-info { background: #333; }
.toast-success { background: #2ecc71; }
.toast-error { background: #e74c3c; }

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px) translateX(-50%); }
  10%, 90% { opacity: 1; transform: translateY(0) translateX(-50%); }
  100% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}
.modal-box {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.modal-box h2 {
  margin-top: 0;
}
.modal-box button {
  margin-top: 10px;
  padding: 8px 12px;
  background: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
`;
document.head.appendChild(style);
