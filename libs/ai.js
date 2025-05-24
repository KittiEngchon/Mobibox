// ---------- สรุปรีวิวจากข้อความหลายอัน ----------
function summarizeReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return "ยังไม่มีรีวิว";

  const keywords = {};
  reviews.forEach(r => {
    const words = r.text.toLowerCase().split(/\s+/);
    words.forEach(w => {
      if (w.length > 3) keywords[w] = (keywords[w] || 0) + 1;
    });
  });

  const sorted = Object.entries(keywords).sort((a, b) => b[1] - a[1]);
  const topWords = sorted.slice(0, 5).map(([word]) => word);
  return `รีวิวยอดนิยม: ${topWords.join(", ")}`;
}

// ---------- ประเมิน Trust Score (0 - 100) ----------
function calculateTrustScore(app, reviews) {
  let score = 50;

  if (app.badges.includes("verified")) score += 15;
  if (app.badges.includes("kyc-passed")) score += 10;
  if (app.badges.includes("audited")) score += 10;
  if (app.badges.includes("ai-certified")) score += 5;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  score += (avgRating - 3) * 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------- AI วิเคราะห์และให้คำแนะนำ ----------
async function getAIInsights(appId, reviews) {
  const summary = summarizeReviews(reviews);
  const app = await getAppById(appId); // assume helper exists
  const trust = calculateTrustScore(app, reviews);

  return {
    summary,
    trustScore: trust,
    suggestion: trust < 50
      ? "แอปนี้ควรระวัง มีความน่าเชื่อต่ำ"
      : trust < 70
        ? "พอใช้ได้ แต่ควรอ่านรีวิวก่อนใช้งาน"
        : "น่าเชื่อถือสูง ใช้งานได้อย่างมั่นใจ"
  };
}
