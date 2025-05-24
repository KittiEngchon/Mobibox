// ✅ wallet.js - เชื่อมต่อ Metamask และจัดการ Wallet

let currentAccount = null;
let isConnecting = false;

async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;

  const connectBtn = document.getElementById("connectBtn");
  if (connectBtn) connectBtn.disabled = true;

  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      window.web3 = new Web3(window.ethereum);

      const walletSpan = document.getElementById("walletAddress");
      if (walletSpan) walletSpan.textContent = shortenAddress(currentAccount);

      showToast("✅ เชื่อมต่อสำเร็จ", "success");
      localStorage.setItem("wallet", currentAccount);
    } catch (err) {
      if (err.code === 4001) {
        // User rejected the connection
        showToast("❌ คุณยกเลิกการเชื่อมต่อ", "error");
      } else {
        console.error("⛔️ MetaMask Error:", err.message);
        showToast("⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
      }
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask");
  }

  if (connectBtn) connectBtn.disabled = false;
  isConnecting = false;
}

function getCurrentWalletAddress() {
  return currentAccount || localStorage.getItem("wallet") || null;
}

function shortenAddress(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "N/A";
}
