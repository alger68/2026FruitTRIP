// ===== AOS INIT =====
AOS.init({
  duration: 700,
  once: true,
  offset: 60,
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== BUDGET CALCULATOR =====
const totalInput = document.getElementById('total-cost');
const peopleInput = document.getElementById('people-count');
const calcResult = document.getElementById('calc-result');
const perPersonDisplay = document.getElementById('per-person-display');
const totalDisplay = document.getElementById('total-display');

function updateCalc() {
  const total = parseFloat(totalInput.value) || 0;
  const people = parseFloat(peopleInput.value) || 1;
  const perPerson = Math.ceil(total / people);
  calcResult.textContent = '$' + perPerson.toLocaleString();
  perPersonDisplay.textContent = '~$' + perPerson.toLocaleString();
  totalDisplay.textContent = '~$' + total.toLocaleString();
}

if (totalInput && peopleInput) {
  totalInput.addEventListener('input', updateCalc);
  peopleInput.addEventListener('input', updateCalc);
  updateCalc();
}

// ===== COPY LINK =====
function copyLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 連結已複製！快分享給大家');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ 連結已複製！快分享給大家');
  });
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
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
