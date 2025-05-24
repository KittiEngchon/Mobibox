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

