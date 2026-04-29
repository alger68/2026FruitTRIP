/* =========================================
   水果幫 2026 宜蘭行 · 紫森林
   Main JavaScript
   ========================================= */

// ── 出發日期（請修改為實際日期）──
const TRIP_DATE = new Date('2026-09-26T07:30:00');
// ── AOS 初始化 ──
AOS.init({ duration: 650, once: true, offset: 50 });

// ══════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// 點導覽連結關閉選單
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('mobileMenu').classList.remove('open');
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' });
    }
  });
});

// ══════════════════════════════════════════
//  PARTICLES
// ══════════════════════════════════════════
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.2};
      background: ${Math.random() > 0.5 ? '#a78bfa' : '#34d399'};
    `;
    container.appendChild(p);
  }
})();

// ══════════════════════════════════════════
//  COUNTDOWN
// ══════════════════════════════════════════
function updateCountdown() {
  const now = new Date();
  const diff = TRIP_DATE - now;

  if (diff <= 0) {
    document.getElementById('countdownWrap').innerHTML =
      '<p style="color:#a78bfa;font-size:1.2rem;font-weight:900">🎉 出發啦！旅程已開始！</p>';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ══════════════════════════════════════════
//  DAY TABS
// ══════════════════════════════════════════
function switchDay(day) {
  document.querySelectorAll('.day-tab').forEach((t, i) => t.classList.toggle('active', i + 1 === day));
  document.querySelectorAll('.day-content').forEach((c, i) => c.classList.toggle('active', i + 1 === day));
}

// ══════════════════════════════════════════
//  MEAL TABS (食)
// ══════════════════════════════════════════
function switchMeal(key) {
  document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.meal-content').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  const target = document.getElementById('food-' + key);
  if (target) target.classList.add('active');
}

// ══════════════════════════════════════════
//  WEATHER (Open-Meteo · 冬山鄉)
// ══════════════════════════════════════════
const WMO = {
  0:  { label:'晴天',    icon:'☀️'  },
  1:  { label:'大致晴',  icon:'🌤️' },
  2:  { label:'局部多雲',icon:'⛅'  },
  3:  { label:'陰天',    icon:'☁️'  },
  45: { label:'有霧',    icon:'🌫️' },
  48: { label:'霧淞',    icon:'🌫️' },
  51: { label:'毛毛雨',  icon:'🌦️' },
  53: { label:'毛毛雨',  icon:'🌦️' },
  55: { label:'毛毛雨',  icon:'🌦️' },
  61: { label:'小雨',    icon:'🌧️' },
  63: { label:'中雨',    icon:'🌧️' },
  65: { label:'大雨',    icon:'🌧️' },
  71: { label:'小雪',    icon:'❄️'  },
  80: { label:'陣雨',    icon:'🌦️' },
  81: { label:'陣雨',    icon:'🌦️' },
  82: { label:'大陣雨',  icon:'🌧️' },
  95: { label:'雷陣雨',  icon:'⛈️' },
  99: { label:'雷陣雨',  icon:'⛈️' },
};

function getWMO(code) {
  return WMO[code] || { label: '未知', icon: '🌡️' };
}

async function loadWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=24.651&longitude=121.772' +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=Asia%2FTaipei&forecast_days=4';

    const res  = await fetch(url);
    const data = await res.json();

    document.getElementById('weather-loading').style.display = 'none';
    const container = document.getElementById('weather-data');
    container.style.display = 'grid';

    const cur   = data.current;
    const daily = data.daily;
    const curW  = getWMO(cur.weather_code);

    const dayNames = ['今天','明天','後天','大後天'];

    let html = `
      <div class="weather-now">
        <div class="weather-now-top">
          <div class="weather-icon-big">${curW.icon}</div>
          <div>
            <div class="weather-now-temp">${Math.round(cur.temperature_2m)}°C</div>
            <div class="weather-now-label">${curW.label} · 冬山鄉</div>
          </div>
        </div>
        <div class="weather-now-stats">
          <div class="weather-stat">💧 濕度 <span>${cur.relative_humidity_2m}%</span></div>
          <div class="weather-stat">💨 風速 <span>${cur.wind_speed_10m} km/h</span></div>
          <div class="weather-stat">🌧️ 降水 <span>${cur.precipitation} mm</span></div>
        </div>
      </div>`;

    for (let i = 0; i < 3; i++) {
      const w = getWMO(daily.weather_code[i]);
      const rain = daily.precipitation_probability_max[i];
      html += `
        <div class="weather-day">
          <div class="weather-day-name">${dayNames[i]}</div>
          <div class="weather-day-icon">${w.icon}</div>
          <div class="weather-day-temp">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</div>
          <div class="weather-day-desc">${w.label}</div>
          <div class="weather-day-rain">🌧️ 降雨機率 ${rain}%</div>
        </div>`;
    }

    container.innerHTML = html;
  } catch (e) {
    document.getElementById('weather-loading').style.display = 'none';
    document.getElementById('weather-error').style.display = 'block';
  }
}
loadWeather();

// ══════════════════════════════════════════
//  BUDGET CALCULATOR
// ══════════════════════════════════════════
const planPresets = {
  'package-holiday':  65400,  // 57000 (20人) + 2800×3 (3人)
  'package-wangri':   57350,  // 51500 + 2450×3
  'package-weekday':  53750,  // 47000 + 2250×3
  'summer-holiday':   64400,  // 2800 × 23
  'summer-weekday':   42550,  // 1850 × 23
  'custom': null,
};

document.getElementById('plan-type').addEventListener('change', function() {
  if (this.value !== 'custom') {
    document.getElementById('accom-cost').value = planPresets[this.value];
    calcBudget();
  }
});

function calcBudget() {
  const accom     = parseFloat(document.getElementById('accom-cost').value) || 0;
  const transport = parseFloat(document.getElementById('transport-cost').value) || 0;
  const tickets   = parseFloat(document.getElementById('ticket-cost').value) || 0;
  const total     = accom + transport + tickets;
  const perPerson = Math.ceil(total / 23);
  document.getElementById('calc-total').textContent = '$' + total.toLocaleString();
  document.getElementById('calc-per').textContent   = '$' + perPerson.toLocaleString();
}

['accom-cost','transport-cost','ticket-cost'].forEach(id =>
  document.getElementById(id).addEventListener('input', calcBudget)
);
calcBudget();

// ══════════════════════════════════════════
//  CHECKLIST
// ══════════════════════════════════════════
const CL_KEY = 'fruittour2026_checklist';

function loadChecklist() {
  const saved = JSON.parse(localStorage.getItem(CL_KEY) || '{}');
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    const key = cb.dataset.key;
    if (saved[key]) {
      cb.checked = true;
      cb.closest('.check-item').classList.add('done');
    }
    cb.addEventListener('change', function() {
      this.closest('.check-item').classList.toggle('done', this.checked);
      saveChecklist();
      updateProgress();
    });
  });
  updateProgress();
}

function saveChecklist() {
  const state = {};
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    state[cb.dataset.key] = cb.checked;
  });
  localStorage.setItem(CL_KEY, JSON.stringify(state));
}

function updateProgress() {
  const all   = document.querySelectorAll('.check-item input[type="checkbox"]');
  const done  = document.querySelectorAll('.check-item input[type="checkbox"]:checked');
  const pct   = all.length ? (done.length / all.length) * 100 : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${done.length} / ${all.length} 完成`;
}

function resetChecklist() {
  localStorage.removeItem(CL_KEY);
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    cb.closest('.check-item').classList.remove('done');
  });
  updateProgress();
  showToast('✅ 清單已重置');
}

loadChecklist();

// ══════════════════════════════════════════
//  PHOTO GALLERY — Cloudinary + JSONBin
// ══════════════════════════════════════════

const isConfigured = () =>
  typeof GALLERY_CONFIG !== 'undefined' &&
  GALLERY_CONFIG.cloudinary.cloudName    !== 'YOUR_CLOUD_NAME' &&
  GALLERY_CONFIG.cloudinary.uploadPreset !== 'YOUR_UPLOAD_PRESET' &&
  GALLERY_CONFIG.jsonbin.binId           !== 'YOUR_BIN_ID' &&
  GALLERY_CONFIG.jsonbin.apiKey          !== 'YOUR_API_KEY';

function setCloudStatus(state, text) {
  const dot  = document.getElementById('cloud-dot');
  const span = document.getElementById('cloud-status-text');
  dot.className  = 'cloud-dot ' + state;
  span.textContent = text;
}

async function loadGallery() {
  if (!isConfigured()) {
    setCloudStatus('no-config', '尚未設定雲端 — 照片暫存於此裝置');
    document.getElementById('cloud-setup-guide').style.display = 'block';
    loadLocalGallery();
    return;
  }
  setCloudStatus('', '連線中…');
  try {
    const photos = await fetchPhotosFromCloud();
    photos.forEach(p => renderPhoto(p, false));
    updateGalleryEmpty();
    setCloudStatus('online', `雲端相簿已連線 · ${photos.length} 張照片`);
  } catch {
    setCloudStatus('offline', '雲端連線失敗，顯示本機照片');
    loadLocalGallery();
  }
}

function loadLocalGallery() {
  const photos = JSON.parse(localStorage.getItem('fruittour2026_gallery') || '[]');
  photos.slice().reverse().forEach(p => renderPhoto(p, false));
  updateGalleryEmpty();
}

// ── Cloudinary upload ──
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', GALLERY_CONFIG.cloudinary.uploadPreset);
  fd.append('folder', GALLERY_CONFIG.folder);
  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${GALLERY_CONFIG.cloudinary.cloudName}/image/upload`,
    { method: 'POST', body: fd }
  );
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return {
    id:        data.public_id,
    src:       data.secure_url,
    thumb:     data.secure_url.replace('/upload/', '/upload/w_600,q_70/'),
    name:      file.name,
    time:      new Date().toLocaleString('zh-TW'),
  };
}

// ── JSONBin read/write ──
const jsonbinHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key':  GALLERY_CONFIG.jsonbin.apiKey,
});

async function fetchPhotosFromCloud() {
  const res  = await fetch(
    `https://api.jsonbin.io/v3/b/${GALLERY_CONFIG.jsonbin.binId}/latest`,
    { headers: jsonbinHeaders() }
  );
  const data = await res.json();
  return Array.isArray(data.record) ? data.record : [];
}

async function savePhotosToCloud(photos) {
  await fetch(
    `https://api.jsonbin.io/v3/b/${GALLERY_CONFIG.jsonbin.binId}`,
    { method: 'PUT', headers: jsonbinHeaders(), body: JSON.stringify(photos) }
  );
}

// ── Upload handler ──
async function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  event.target.value = '';
  if (!files.length) return;

  const useCloud = isConfigured();
  const progress = document.getElementById('upload-progress');
  const statusTx = document.getElementById('upload-status-text');
  progress.style.display = 'block';

  for (let i = 0; i < files.length; i++) {
    statusTx.textContent = `上傳中 ${i + 1} / ${files.length}…`;
    try {
      let photo;
      if (useCloud) {
        photo = await uploadToCloudinary(files[i]);
        const existing = await fetchPhotosFromCloud();
        existing.push(photo);
        await savePhotosToCloud(existing);
        setCloudStatus('online', `雲端相簿已連線 · ${existing.length} 張照片`);
      } else {
        photo = await compressToLocal(files[i]);
        const local = JSON.parse(localStorage.getItem('fruittour2026_gallery') || '[]');
        local.push(photo);
        try { localStorage.setItem('fruittour2026_gallery', JSON.stringify(local)); }
        catch { showToast('⚠️ 本機空間已滿'); break; }
      }
      renderPhoto(photo, true);
      updateGalleryEmpty();
    } catch {
      showToast(`⚠️ 第 ${i + 1} 張上傳失敗，請重試`);
    }
  }
  progress.style.display = 'none';
  showToast('✅ 照片上傳完成！');
}

// ── Local compress fallback ──
function compressToLocal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const ratio  = Math.min(800 / img.width, 800 / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = img.width  * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          id:    Date.now() + Math.random(),
          src:   canvas.toDataURL('image/jpeg', 0.72),
          thumb: canvas.toDataURL('image/jpeg', 0.72),
          name:  file.name,
          time:  new Date().toLocaleString('zh-TW'),
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderPhoto(photo, prepend = true) {
  const grid = document.getElementById('gallery-grid');
  const item = document.createElement('div');
  item.className  = 'gallery-item';
  item.dataset.id = String(photo.id);
  const src = photo.thumb || photo.src;
  item.innerHTML = `
    <img src="${src}" alt="${escapeHtml(photo.name)}" loading="lazy"
         onclick="openLightbox('${photo.src}','${escapeHtml(photo.name)} · ${photo.time}')"/>
    <button class="gallery-item-del" onclick="deletePhoto(event,'${String(photo.id)}')">✕</button>
  `;
  if (prepend) grid.insertBefore(item, grid.firstChild);
  else grid.appendChild(item);
}

async function deletePhoto(e, id) {
  e.stopPropagation();
  if (!confirm('確定刪除這張照片？')) return;
  document.querySelector(`.gallery-item[data-id="${id}"]`)?.remove();
  updateGalleryEmpty();
  if (isConfigured()) {
    try {
      const photos = (await fetchPhotosFromCloud()).filter(p => String(p.id) !== String(id));
      await savePhotosToCloud(photos);
      setCloudStatus('online', `雲端相簿已連線 · ${photos.length} 張照片`);
    } catch { showToast('⚠️ 雲端刪除失敗'); }
  } else {
    const local = JSON.parse(localStorage.getItem('fruittour2026_gallery') || '[]').filter(p => String(p.id) !== String(id));
    localStorage.setItem('fruittour2026_gallery', JSON.stringify(local));
  }
}

function updateGalleryEmpty() {
  const items = document.querySelectorAll('.gallery-item');
  document.getElementById('gallery-empty').style.display = items.length ? 'none' : 'block';
}

function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lb.classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

loadGallery();

// ══════════════════════════════════════════
//  GUESTBOOK
// ══════════════════════════════════════════
const GB_KEY = 'fruittour2026_guestbook';

// Character counter
document.getElementById('gb-message').addEventListener('input', function() {
  document.getElementById('gb-char-count').textContent = `${this.value.length} / 200`;
});

function loadGuestbook() {
  const msgs = JSON.parse(localStorage.getItem(GB_KEY) || '[]');
  if (!msgs.length) {
    document.getElementById('guestbook-messages').innerHTML =
      '<div class="gb-empty">💬 快來留下第一則留言！</div>';
    return;
  }
  msgs.slice().reverse().forEach(m => renderMessage(m, false));
}

function submitGuestbook() {
  const name    = document.getElementById('gb-name').value.trim();
  const emoji   = document.getElementById('gb-emoji').value;
  const message = document.getElementById('gb-message').value.trim();

  if (!name)    { showToast('⚠️ 請輸入名字'); return; }
  if (!message) { showToast('⚠️ 請輸入留言內容'); return; }

  const entry = { id: Date.now(), name, emoji, message, time: new Date().toLocaleString('zh-TW') };
  const stored = JSON.parse(localStorage.getItem(GB_KEY) || '[]');
  stored.push(entry);
  localStorage.setItem(GB_KEY, JSON.stringify(stored));

  // Clear placeholder
  const container = document.getElementById('guestbook-messages');
  const empty = container.querySelector('.gb-empty');
  if (empty) empty.remove();

  renderMessage(entry, true);

  document.getElementById('gb-name').value = '';
  document.getElementById('gb-message').value = '';
  document.getElementById('gb-char-count').textContent = '0 / 200';
  showToast('💌 留言成功！');
}

function renderMessage(msg, prepend) {
  const container = document.getElementById('guestbook-messages');
  const card = document.createElement('div');
  card.className = 'gb-card';
  card.innerHTML = `
    <div class="gb-card-header">
      <span class="gb-emoji">${msg.emoji}</span>
      <span class="gb-name">${escapeHtml(msg.name)}</span>
      <span class="gb-time">${msg.time}</span>
    </div>
    <p class="gb-msg">${escapeHtml(msg.message)}</p>
  `;
  if (prepend) {
    container.insertBefore(card, container.firstChild);
  } else {
    container.appendChild(card);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadGuestbook();

// ══════════════════════════════════════════
//  UTILITY
// ══════════════════════════════════════════
function copyLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
  showToast('✅ 連結已複製，快分享給大家！');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
