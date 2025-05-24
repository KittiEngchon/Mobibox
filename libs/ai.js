// libs/ai.js

// ---------- โหลดข้อมูลจาก NovaVault เพื่อประเมิน developer reputation ----------
async function getDeveloperReputation(address) {
  try {
    const res = await fetch(`https://api.novavault.network/reputation/${address}`);
    const data = await res.json();
    return data.score || 50;
  } catch (e) {
    console.warn("NovaVault API failed, fallback to 50");
    return 50;
  }
}

// ---------- วิเคราะห์ Sentiment จากรีวิว ----------
function analyzeSentiment(text) {
  const positiveWords = ['ดี', 'เยี่ยม', 'ชอบ', 'เร็ว', 'ปลอดภัย', 'น่าเชื่อถือ'];
  const negativeWords = ['โกง', 'แย่', 'ช้า', 'หลอก', 'บั๊ก', 'หาย'];

  let score = 0;
  const words = text.toLowerCase().split(/\s+/);
  words.forEach(w => {
    if (positiveWords.includes(w)) score++;
    if (negativeWords.includes(w)) score--;
  });

  return score;
}

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

// ---------- คำนวณ Trust Score ด้วย AI ----------
async function calculateTrustScoreAI(app, reviews) {
  let score = 50;

  if (app.badges.includes("verified")) score += 15;
  if (app.badges.includes("kyc-passed")) score += 10;
  if (app.badges.includes("audited")) score += 10;
  if (app.badges.includes("ai-certified")) score += 5;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  score += (avgRating - 3) * 10;

  const sentiment = reviews.reduce((sum, r) => sum + analyzeSentiment(r.comment || r.text || ""), 0);
  score += sentiment;

  const repScore = await getDeveloperReputation(app.developer);
  score += (repScore - 50) * 0.5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------- AI วิเคราะห์และให้คำแนะนำ ----------
async function getAIInsights(appId, reviews) {
  const app = await getAppById(appId); // ใช้ helper จาก libs อื่น
  const trust = await calculateTrustScoreAI(app, reviews);
  const summary = summarizeReviews(reviews);
  const suggestion = trust < 50
    ? "⚠️ แอปนี้ควรระวัง มีความน่าเชื่อต่ำ"
    : trust < 70
      ? "🔍 พอใช้ได้ แต่ควรอ่านรีวิวก่อนใช้งาน"
      : "✅ น่าเชื่อถือสูง ใช้งานได้อย่างมั่นใจ";

  return { trustScore: trust, summary, suggestion };
}

