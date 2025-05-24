// libs/wallet.js

let currentAccount = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      window.web3 = new Web3(window.ethereum);

      document.getElementById("walletAddress").textContent = shortenAddress(currentAccount);
      showToast("✅ เชื่อมต่อสำเร็จ");

      // เก็บใน localStorage เผื่อใช้ต่อ
      localStorage.setItem("wallet", currentAccount);

    } catch (err) {
      console.error("User rejected connection", err);
      showToast("❌ ยกเลิกการเชื่อมต่อ");
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask");
  }
}

function getCurrentWalletAddress() {
  return currentAccount || localStorage.getItem("wallet") || null;
}

function shortenAddress(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}
