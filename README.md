/index.html                 <-- หน้าแรก (โชว์แอปทั้งหมด + connect wallet)
/app.html                   <-- หน้ารายละเอียดแอป
/admin.html                 <-- หน้าจัดการแอป (ผู้ดูแลเท่านั้น)
/assets/                    <-- ไฟล์ภาพ โลโก้ background, icon ต่าง ๆ
/libs/
  └─ web3.min.js            <-- Web3.js สำหรับเชื่อม Metamask
  └─ novavault.js           <-- SDK หรือ helper ดึงข้อมูลผู้ใช้
  └─ ai.js                  <-- ฟังก์ชันเรียก AI เช่น สรุปรีวิว, trust score
  └─ wallet.js              <-- ฟังก์ชัน connect wallet
  └─ ui.js                  <-- Popup, Toast, Modal, Theme toggle
  └─ review.js              <-- ฟอร์มรีวิว, ส่ง/รับข้อมูล, เช็กสิทธิ์ถือเหรียญ
  └─ analytics.js           <-- ระบบเก็บ event, วิเคราะห์ dashboard
/data/
  └─ apps.json              <-- ข้อมูลแอปทั้งหมด (ชื่อ, คำอธิบาย, badge, rating)
  └─ reviews.json           <-- ข้อมูลรีวิวจากผู้ใช้
  └─ tokens.json            <-- รายชื่อเหรียญที่อนุญาตให้รีวิว
  └─ chains.json            <-- รายชื่อเครือข่าย (Ethereum, Polygon)

