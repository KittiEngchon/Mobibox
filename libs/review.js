// ✅ review.js – จัดการรีวิวผู้ใช้ + ตรวจสิทธิ์ถือเหรียญ + render UI

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

// ตรวจสอบสิทธิ์การรีวิว (ถือเหรียญตามที่กำหนด)
async function checkReviewEligibility(userAddress) {
  const res = await fetch('/data/tokens.json');
  const tokens = await res.json();

  for (const token of tokens) {
    const balance = await getTokenBalance(token.address, userAddress);
    if (balance > 0) return true;
  }
  return false;
}

// เช็ก token balance ด้วย Web3
async function getTokenBalance(tokenAddress, userAddress) {
  const token = new window.web3.eth.Contract([
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function'
    }
  ], tokenAddress);

  const raw = await token.methods.balanceOf(userAddress).call();
  return parseFloat(window.web3.utils.fromWei(raw, 'ether'));
}

// ส่งรีวิว (mock log + พร้อมส่งไป backend ภายหลัง)
async function submitReview({ appId, reviewer, comment, rating }) {
  const review = { appId, reviewer, comment, rating, timestamp: new Date().toISOString() };

  // log + toast
  console.log("📤 Review Submitted:", review);
  showToast("✅ ขอบคุณสำหรับรีวิว!");

  // ในอนาคตสามารถ POST ไป backend หรือ IPFS
  // await fetch("/api/reviews", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(review)
  // });

  return review;
}

// เรนเดอร์ฟอร์ม + ดำเนินการส่ง
async function renderReviewForm(containerId, appId, userAddress) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="review-form">
      <textarea id="comment" placeholder="แสดงความคิดเห็น..."></textarea>
      <select id="rating">
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>
      <button id="submitBtn">ส่งรีวิว</button>
    </div>
  `;

  document.getElementById("submitBtn").onclick = async () => {
    const comment = document.getElementById("comment").value;
    const rating = parseInt(document.getElementById("rating").value);

    if (!userAddress) return alert("กรุณาเชื่อม wallet ก่อน");
    const canReview = await checkReviewEligibility(userAddress);
    if (!canReview) return alert("คุณไม่มีสิทธิ์รีวิว (ต้องถือเหรียญ)");

    await submitReview({ appId, reviewer: userAddress, comment, rating });
  };
}

// แสดงรีวิวที่โหลดมา
async function renderReviews(containerId, appId) {
  const container = document.getElementById(containerId);
  const reviews = await getReviewsByApp(appId);

  container.innerHTML = reviews.map(r => `
    <div class="review">
      <div><b>🌟 ${r.rating}</b> โดย ${r.reviewer}</div>
      <div>${r.comment}</div>
      <div style="font-size: 0.8em;">🕒 ${new Date(r.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}

// คำนวณเรตติ้งเฉลี่ยของแอป
async function getAverageRating(appId) {
  const reviews = await getReviewsByApp(appId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, r) => total + (r.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}


