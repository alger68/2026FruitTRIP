/* ================================================
   水果幫 2026 · 雲端相簿設定
   ================================================

   設定步驟：

   【第一步：Cloudinary 圖片儲存】
   1. 前往 https://cloudinary.com → 免費註冊
   2. 進入 Dashboard → 複製「Cloud name」
   3. 進入 Settings → Upload → 新增 Upload Preset
      ✓ Signing Mode 選「Unsigned」
      ✓ 名稱隨意（例如 fruittour2026）
      ✓ 儲存後複製 Preset Name

   【第二步：JSONBin 共享清單】
   1. 前往 https://jsonbin.io → 免費註冊
   2. 點「+ Create Bin」→ 內容輸入 []  → 儲存
   3. 複製 Bin ID（網址列的那串）
   4. 前往 API Keys → 複製 X-Master-Key

   【第三步：填入下方】
   ================================================ */

const GALLERY_CONFIG = {
  // ── Cloudinary ──────────────────────────────
  cloudinary: {
    cloudName:    'YOUR_CLOUD_NAME',     // 例如: dxxabcdef
    uploadPreset: 'YOUR_UPLOAD_PRESET',  // 例如: fruittour2026
  },

  // ── JSONBin ─────────────────────────────────
  jsonbin: {
    binId:  'YOUR_BIN_ID',  // 例如: 664a1b2c3d4e5f6g7h8i9j0
    apiKey: 'YOUR_API_KEY', // 例如: $2a$10$xxxxxxxxxxxxxxxxxxxxxxxx
  },

  // ── 旅遊資訊 ────────────────────────────────
  tripName: '水果幫2026宜蘭行',
  folder:   'fruittour2026',  // Cloudinary 資料夾名稱
};
