const viewport = document.querySelector('.projects-viewport');
const track    = document.querySelector('.projects-track');
const list     = document.querySelector('.projects-list');
const btnPrev  = document.querySelector('[data-prev]');
const btnNext  = document.querySelector('[data-next]');

// Gather original items and assign each a stable index via data attribute
const originalItems = Array.from(list.querySelectorAll('.project-item'));
originalItems.forEach((el, i) => {
  el.dataset.oi = i;
});

// Number of items to display fully in the centre of the viewport
const VISIBLE = 2;

// We clone a cushion of elements on each side. With two fully visible
// elements we also display their immediate neighbours (left and right),
// therefore we need two additional clones on each side: VISIBLE + 2
const CLONE_COUNT = VISIBLE + 2;

// Clone the last CLONE_COUNT items and insert them before the original list
const prepend = originalItems.slice(-CLONE_COUNT).map(el => {
  const clone = el.cloneNode(true);
  clone.dataset.oi = el.dataset.oi;
  return clone;
});
prepend.forEach(c => list.insertBefore(c, list.firstChild));

// Clone the first CLONE_COUNT items and append them after the original list
const append = originalItems.slice(0, CLONE_COUNT).map(el => {
  const clone = el.cloneNode(true);
  clone.dataset.oi = el.dataset.oi;
  return clone;
});
append.forEach(c => list.appendChild(c));

// Collect all items including clones
const items = Array.from(list.querySelectorAll('.project-item'));

// Animation timing constants
const SLIDE_DURATION    = 0.65;
const OPACITY_DURATION  = 0.18;
const MIN_CLICK_INTERVAL = 140;

// Determine the translation step for each item: its width plus the gap
function getStep() {
  const w   = items[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(list).gap || 0);
  return w + gap;
}

// A modulo helper that always yields a positive result in [0, m)
function modulo(n, m) {
  return ((n % m) + m) % m;
}

// Index in the extended list that represents the leftmost fully visible item.
// Initialise so that the first original item appears centred on load.
let index = CLONE_COUNT;

// Track state of current animation and time of last click
let anim         = null;
let isAnimating  = false;
let lastClickAt  = 0;

// Create quick GSAP setters for controlling opacity on each element
const opSetters = new Map();
items.forEach(el => {
  opSetters.set(el, gsap.quickTo(el, 'opacity', {
    duration: OPACITY_DURATION,
    ease: 'power2.out',
    overwrite: true
  }));
});

// Normalise the index when it moves into a cloned region. If the index is
// within the left cloned region (< CLONE_COUNT) we teleport it forward by
// the length of the original list. Conversely, if it is within the right
// cloned region (>= original length + CLONE_COUNT), we teleport it backward.
function normalize(to) {
  const len = originalItems.length;
  let n = to;
  const step = getStep();

  if (n < CLONE_COUNT) {
    n += len;
    gsap.set(track, { x: -step * n });
    index = n;
    updateOpacity(true);
  } else if (n >= len + CLONE_COUNT) {
    n -= len;
    gsap.set(track, { x: -step * n });
    index = n;
    updateOpacity(true);
  }
  return n;
}

function wrapBeforeAnim(to) {
  const len = originalItems.length;
  let t = to;
  if (t < CLONE_COUNT) t += len;
  else if (t >= len + CLONE_COUNT) t -= len;
  return t;
}

// Update opacity for all items. Central pair appears with opacity 1, their
// immediate neighbours with 0.4, and all others with 0.15. The opacity is
// computed based on the logical index within the original list.
function updateOpacity(immediate = false) {
  const len = originalItems.length;
  // logicalLeft indexes into the original list, derived from the extended index
  const logicalLeft = modulo(index - CLONE_COUNT, len);
  const centreA = logicalLeft;
  const centreB = modulo(logicalLeft + 1, len);
  const nearL  = modulo(logicalLeft - 1, len);
  const nearR  = modulo(logicalLeft + 2, len);

  items.forEach(el => {
    const oi = Number(el.dataset.oi);
    let target;
    if (oi === centreA || oi === centreB) {
      target = 1;
    } else if (oi === nearL || oi === nearR) {
      target = 0.4;
    } else {
      target = 0.15;
    }
    if (immediate) {
      gsap.set(el, { opacity: target });
    } else {
      opSetters.get(el)(target);
    }
  });
}

// Animate to the desired index. If `immediate` is true, instantly move to
// the target and update opacity without animation. Otherwise, respect
// minimum click interval and skip if an animation is already running.
function go(to, opts = {}) {
  const immediate = !!opts.immediate;

  // мгновенная установка (как у тебя и было)
  if (immediate) {
    if (anim) anim.kill();
    isAnimating = false;
    index = normalize(to);
    gsap.set(track, { x: -getStep() * index });
    updateOpacity(true);
    return;
  }

  const now = performance.now();
  if (isAnimating) return;
  if (now - lastClickAt < MIN_CLICK_INTERVAL) return;
  lastClickAt = now;

  isAnimating = true;
  if (anim) anim.kill();

  const step = getStep();
  const len  = originalItems.length;
  const leftBound  = CLONE_COUNT;
  const rightBound = CLONE_COUNT + len - 1;

  // хотим сдвинуться относительно текущего
  let target = to;

  // ДВИЖЕНИЕ ПО ГРАНИЦЕ:
  // Если выходим за левую границу — сперва телепортируемся на +len (вправо) без анимации,
  // чтобы цель стала ближней, а не через весь круг.
  if (target < leftBound) {
    const preIndex = index + len;              // визуально та же пара
    gsap.set(track, { x: -step * preIndex });  // мгновенный «перепрыг»
    index  = preIndex;
    target = to + len;                         // делаем один шаг влево, но уже внутри окна
  }
  // Аналогично для правой границы (если идём вправо из правого края)
  else if (target > rightBound) {
    const preIndex = index - len;
    gsap.set(track, { x: -step * preIndex });
    index  = preIndex;
    target = to - len;
  }

  // Короткая анимация ровно на один шаг
  anim = gsap.to(track, {
    x: -step * target,
    duration: SLIDE_DURATION,
    ease: 'power2.out',
    onUpdate: () => updateOpacity(false),
    onComplete: () => {
      // фиксируем точный индекс и позицию на сетку, без пост-нормализаций и оборотов
      index = target;
      gsap.set(track, { x: -Math.round(step * index) });
      updateOpacity(true);
      isAnimating = false;
    }
  });

  // актуализируем «текущий» индекс для updateOpacity во время анимации
  index = target;
  updateOpacity(false);
}


// Click handlers for navigation buttons
btnPrev && btnPrev.addEventListener('click', () => go(index - 1));
btnNext && btnNext.addEventListener('click', () => go(index + 1));

// On resize, reposition items and recalculate step after a short debounce
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const step = getStep();
    gsap.set(track, { x: -step * index });
    updateOpacity(true);
  }, 60);
});

// Initial setup: place the list at the correct position and set initial opacity
go(index, { immediate: true });