// โหลดรีวิวทั้งหมดจากไฟล์
async function loadReviews() {
  const res = await fetch('/data/reviews.json');
  const data = await res.json();
  return data;
}

// ดึงเฉพาะรีวิวของแอปตาม id
async function getReviewsByApp(appId) {
  const all = await loadReviews();
  return all.filter(r => r.appId === appId);
}

// เช็กสิทธิ์ถือเหรียญก่อนรีวิว (mock แบบง่าย)
async function checkReviewEligibility(userAddress) {
  const res = await fetch('/data/tokens.json');
  const tokens = await res.json();

  for (const token of tokens) {
    const balance = await getTokenBalance(token.address, userAddress);
    if (balance > 0) return true;
  }
  return false;
}

// ฟังก์ชัน mock สำหรับเช็ก token balance
async function getTokenBalance(tokenAddress, userAddress) {
  // ใช้ web3.js เรียก balanceOf แบบมาตรฐาน ERC-20
  const token = new window.web3.eth.Contract([
    { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }],
      "type": "function"
    }
  ], tokenAddress);

  const raw = await token.methods.balanceOf(userAddress).call();
  return parseFloat(window.web3.utils.fromWei(raw, 'ether'));
}

// คำนวณเรตติ้งเฉลี่ยของแอป
async function getAverageRating(appId) {
  const reviews = await getReviewsByApp(appId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, r) => total + (r.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

// ส่งรีวิว (ในระบบจริงจะ POST ไป backend แต่ใน mock เราแค่ log)
function submitReview({ appId, reviewer, comment, rating }) {
  console.log("📤 Review Submitted:", { appId, reviewer, comment, rating });
  showToast("✅ ขอบคุณสำหรับรีวิว!");
}
