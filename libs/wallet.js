// เชื่อมต่อ Metamask
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('Metamask ไม่พร้อมใช้งาน กรุณาติดตั้ง Metamask');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    console.log('✅ Connected wallet:', walletAddress);
    showToast(`🦊 Connected: ${shorten(walletAddress)}`);
    updateConnectButton(walletAddress);
  } catch (err) {
    console.error('❌ Wallet connection error:', err);
    alert('การเชื่อมต่อถูกยกเลิก หรือเกิดข้อผิดพลาด');
  }
}

// ฟังก์ชันย่อ address
function shorten(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// อัปเดตปุ่มเมื่อเชื่อมต่อแล้ว
function updateConnectButton(address) {
  const btn = document.getElementById('connectBtn');
  btn.textContent = shorten(address);
  btn.disabled = true;
}
