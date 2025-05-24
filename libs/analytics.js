// ---------- เก็บกิจกรรมผู้ใช้ ----------
const analytics = {
  data: [],
  
  trackEvent: function(type, details = {}) {
    const timestamp = new Date().toISOString();
    const address = window.ethereum?.selectedAddress || "unknown";

    this.data.push({ type, details, timestamp, address });

    // Optional: บันทึกลง localStorage สำรองไว้
    localStorage.setItem("analytics", JSON.stringify(this.data));
  },

  // ---------- ส่งออกไปยัง backend หรือ NovaVault (ถ้ามี) ----------
  saveAnalytics: async function() {
    try {
      // TODO: เปลี่ยนเป็น API endpoint ของคุณ หรือ NovaVault
      console.log("🛰️ Saving analytics...", this.data);

      // ตัวอย่าง: ส่งข้อมูลไปยัง API ของคุณ
      /*
      await fetch("/api/save-analytics", {
        method: "POST",
        body: JSON.stringify(this.data),
        headers: { "Content-Type": "application/json" }
      });
      */

      // เคลียร์ log หลังส่ง
      this.data = [];
      localStorage.removeItem("analytics");
    } catch (e) {
      console.warn("⚠️ Failed to send analytics:", e);
    }
  },

  // ---------- สร้างรายงานแบบรวม (ใช้ใน admin.html) ----------
  generateReport: function() {
    const counts = {};
    this.data.forEach(entry => {
      counts[entry.type] = (counts[entry.type] || 0) + 1;
    });
    return counts;
  }
};
