// ✅ QRCode generator ไม่ใช้ eval - ใช้ไลบรารี qrcode@1.5.3
// โหลดผ่าน <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>

// 📦 สร้าง QR ลง <canvas> จากลิงก์หรือข้อความ
function generateQRCode(targetElementId, text, size = 160) {
  const canvas = document.getElementById(targetElementId);
  if (!canvas) return console.warn("❗ ไม่พบ element สำหรับ QR code:", targetElementId);

  QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff00"
    }
  }, function (error) {
    if (error) {
      console.error("❌ QR Error:", error);
      showToast("เกิดข้อผิดพลาดในการสร้าง QR", "error");
    } else {
      console.log("✅ QR generated:", text);
    }
  });
}
