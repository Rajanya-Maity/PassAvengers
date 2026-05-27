// ── DOM refs ──────────────────────────────────────────────────────
const input        = document.getElementById('password-input');
const toggleBtn    = document.getElementById('toggle-btn');
const eyeOpen      = document.getElementById('eye-open');
const eyeClosed    = document.getElementById('eye-closed');
const meterFill    = document.getElementById('meter-fill');
const meterGlow    = document.getElementById('meter-glow');
const strengthLabel= document.getElementById('strength-label');
const scoreNumber  = document.getElementById('score-number');
const criteriaList = document.getElementById('criteria-list');

// ── Toggle visibility ─────────────────────────────────────────────
toggleBtn.addEventListener('click', () => {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  eyeOpen.classList.toggle('hidden', isPassword);
  eyeClosed.classList.toggle('hidden', !isPassword);
});

// ── Colour interpolation: red → orange → yellow → green ───────────
function scoreToColor(score) {
  // 0–40: red → orange, 40–70: orange → yellow-green, 70–100: yellow-green → green
  if (score <= 0)   return [231, 76, 60];     // red
  if (score >= 100) return [30, 132, 73];      // deep green

  const stops = [
    { at: 0,   rgb: [231, 76,  60]  },   // red
    { at: 35,  rgb: [230, 126, 34]  },   // orange
    { at: 60,  rgb: [243, 156, 18]  },   // amber
    { at: 80,  rgb: [39,  174, 96]  },   // green
    { at: 100, rgb: [30,  132, 73]  },   // deep green
  ];

  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (score >= stops[i].at && score <= stops[i + 1].at) {
      lo = stops[i]; hi = stops[i + 1]; break;
    }
  }

  const t = (score - lo.at) / (hi.at - lo.at);
  return lo.rgb.map((c, i) => Math.round(c + t * (hi.rgb[i] - c)));
}

function rgbStr([r, g, b]) { return `rgb(${r},${g},${b})`; }

// ── Animated score counter ────────────────────────────────────────
let currentDisplayScore = 0;
let animFrame = null;
function animateScore(target) {
  if (animFrame) cancelAnimationFrame(animFrame);
  const start = currentDisplayScore;
  const startTime = performance.now();
  const duration = 500;
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    currentDisplayScore = Math.round(start + (target - start) * eased);
    scoreNumber.textContent = currentDisplayScore;
    if (progress < 1) animFrame = requestAnimationFrame(step);
  }
  animFrame = requestAnimationFrame(step);
}

// ── Render criteria list ──────────────────────────────────────────
function renderCriteria(feedback) {
  criteriaList.innerHTML = '';
  feedback.forEach(item => {
    const li = document.createElement('li');
    li.className = 'criteria-item' + (item.met ? ' met' : '');
    li.innerHTML = `
      <span class="criteria-icon">${item.met ? '✓' : '·'}</span>
      <span>${item.text}</span>
    `;
    criteriaList.appendChild(li);
  });
}

// ── Debounce ──────────────────────────────────────────────────────
let debounceTimer = null;
function debounce(fn, delay) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(...args), delay);
  };
}

// ── Main check ───────────────────────────────────────────────────
async function checkPassword(password) {
  if (!password) {
    meterFill.style.width = '0%';
    meterGlow.style.width = '0%';
    strengthLabel.textContent = '—';
    strengthLabel.style.color = '';
    animateScore(0);
    criteriaList.innerHTML = '';
    return;
  }

  try {
    const res = await fetch('/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    const { score, label, feedback } = data;

    // Colour
    const color = rgbStr(scoreToColor(score));

    // Meter
    meterFill.style.width  = score + '%';
    meterFill.style.background = color;
    meterGlow.style.width  = score + '%';
    meterGlow.style.background = color;

    // Label
    strengthLabel.textContent = label;
    strengthLabel.style.color = color;

    // Score
    animateScore(score);

    // Criteria
    renderCriteria(feedback);

  } catch (err) {
    console.error('Password check failed:', err);
  }
}

const debouncedCheck = debounce(checkPassword, 120);
input.addEventListener('input', () => debouncedCheck(input.value));
