// NovaVault SDK URL (mock หรือเรียกจริงถ้ามี endpoint)
const NOVAVAULT_API = "https://api.novavault.xyz/user"; // สมมุติฐาน

// ดึงข้อมูล NovaVault ของ address ที่เชื่อมอยู่
async function getUserFromNovaVault(address) {
  try {
    const res = await fetch(`${NOVAVAULT_API}/${address}`);
    if (!res.ok) throw new Error("ไม่พบผู้ใช้ในระบบ NovaVault");
    const data = await res.json();

    // แสดงผลใน console (หรือจะโยนไปแสดงในหน้าก็ได้)
    console.log("🎯 NovaVault User:", data);

    return {
      did: data.did,
      trustScore: data.trustScore,
      kyc: data.kycStatus,
      badges: data.badges || []
    };
  } catch (err) {
    console.error("❌ NovaVault fetch error:", err);
    showToast("ไม่สามารถโหลดข้อมูล NovaVault ได้");
    return null;
  }
}

// ใช้ในแอปเมื่อเชื่อม wallet แล้ว เช่น
// const user = await getUserFromNovaVault(walletAddress);
