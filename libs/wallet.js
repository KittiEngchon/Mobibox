let isConnecting = false;

async function connectWallet() {
  if (isConnecting) return; // 🛑 ป้องกันเรียกซ้ำ
  isConnecting = true;

  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      window.web3 = new Web3(window.ethereum);

      const walletSpan = document.getElementById("walletAddress");
      if (walletSpan) walletSpan.textContent = shortenAddress(currentAccount);

      showToast("✅ เชื่อมต่อสำเร็จ", "success");
      localStorage.setItem("wallet", currentAccount);
    } catch (err) {
      console.error("⛔️ MetaMask Error:", err.message);
      showToast("❌ เชื่อมต่อไม่สำเร็จ", "error");
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask");
  }

  isConnecting = false;
}
