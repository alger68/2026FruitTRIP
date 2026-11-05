# 30 分鐘運動冒險島：多人同步設定

`move30.html` 預設是單機模式。接上 Firebase Realtime Database 後，大家的手機就會共用同一座島
（打卡、動態牆、TOP 20 投票、週日集合名單、角色鎖定都會同步）。

## 一、建立資料庫（約 5 分鐘，免費）

1. 到 https://console.firebase.google.com ，建立專案（可關閉 Google Analytics）。
2. 左側 Build → **Realtime Database** → 建立資料庫，位置選 `asia-southeast1`，先選「測試模式」。
3. 進入 **Rules** 分頁，貼上下面規則並發布（只開放 `rooms` 底下）：

```json
{
  "rules": {
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. 複製資料庫網址，長得像 `https://你的專案-default-rtdb.asia-southeast1.firebasedatabase.app`。

## 二、告訴遊戲這個網址（二選一）

- **改檔案：** 編輯 `move30.html`，把 `SYNC_CONFIG.dbUrl` 填成上面的網址。
- **用連結：** 不改檔案，直接分享 `…/move30.html?db=網址`（QR Code 也用這個連結）。

可用 `&room=場次名稱` 開不同場次，各場資料互不影響。

## 三、用 GitHub Pages 開放給大家

repo → Settings → Pages → Source 選 Deploy from a branch，Branch 選 `main`（或這個分支）、資料夾 `/ (root)`。
網址為 `https://alger68.github.io/2026FruitTRIP/move30.html`。

## 注意

- 規則是公開讀寫，知道網址的人都能改資料，適合活動當天使用。活動結束後請到 Firebase 刪除資料庫或把 Rules 改成 `false`。
- 照片會以壓縮後的 JPEG 存在資料庫裡，活動規模（幾十人）免費額度足夠。
- 畫面約每 3 秒同步一次。
