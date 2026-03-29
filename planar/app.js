// ============================================
// PlanAlarm - Smart Plan & Alarm Manager
// With Persistent Floating Countdown Overlay
// ============================================

// --- State ---
let plans = [];
let soundEnabled = true;
let currentFilter = 'all';
let editingPlanId = null;
let alarmEnabled = true;
let repeatEnabled = false;
let selectedDateType = 'today';
let activeAlarmId = null;
let audioCtx = null;
let floatingOverlayEnabled = true;
let floatingExpanded = false;
let floatingDragActive = false;
let floatingPos = { x: 16, y: 100 };
let onboardingDone = false;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadPlans();
  updateDate();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(checkAlarms, 1000);

  // Default time
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  document.getElementById('timeInput').value = formatTimeValue(nextHour);
  document.getElementById('dateInput').value = formatDateValue(new Date());

  // Check onboarding
  onboardingDone = localStorage.getItem('planAlarm_onboarded') === 'true';
  if (!onboardingDone) {
    document.getElementById('onboardingScreen').classList.remove('hidden');
    updatePermStatuses();
  } else {
    document.getElementById('onboardingScreen').classList.add('hidden');
    initFloatingOverlay();
  }

  renderPlans();
});

// ============================================
// ONBOARDING & PERMISSIONS
// ============================================

async function grantNotificationPerm() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported in this browser');
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      updatePermStatuses();
      showToast('Notifications enabled!');
    } else {
      updatePermStatuses();
      showToast('Notification permission denied');
    }
  } catch (e) {
    showToast('Could not request permission');
  }
}

function showOverlayInfo() {
  const modal = document.getElementById('overlayInfoModal');
  const content = document.getElementById('overlayInfoContent');
  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    content.style.transform = 'translateY(0)';
  });
}

function closeOverlayInfo() {
  const content = document.getElementById('overlayInfoContent');
  content.style.transform = 'translateY(100%)';
  setTimeout(() => {
    document.getElementById('overlayInfoModal').classList.add('hidden');
  }, 300);
  // Mark as seen
  localStorage.setItem('planAlarm_overlayInfoSeen', 'true');
  updatePermStatuses();
}

function updatePermStatuses() {
  // Notification status
  const notifEl = document.getElementById('permNotifStatus');
  if ('Notification' in window && Notification.permission === 'granted') {
    notifEl.textContent = 'Granted';
    notifEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase';
  } else if ('Notification' in window && Notification.permission === 'denied') {
    notifEl.textContent = 'Denied';
    notifEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 uppercase';
  }

  // Overlay info status
  const overlayEl = document.getElementById('permOverlayStatus');
  if (localStorage.getItem('planAlarm_overlayInfoSeen') === 'true') {
    overlayEl.textContent = 'Info Seen';
    overlayEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase';
  }
}

function finishOnboarding() {
  localStorage.setItem('planAlarm_onboarded', 'true');
  onboardingDone = true;
  document.getElementById('onboardingScreen').style.animation = 'fadeOut 0.3s ease-out forwards';
  setTimeout(() => {
    document.getElementById('onboardingScreen').classList.add('hidden');
    document.getElementById('onboardingScreen').style.animation = '';
    initFloatingOverlay();
  }, 300);
}

function showOnboarding() {
  closeSettings();
  setTimeout(() => {
    document.getElementById('onboardingScreen').classList.remove('hidden');
    document.getElementById('onboardingScreen').style.animation = 'fadeIn 0.3s ease-out';
    updatePermStatuses();
  }, 350);
}

function testAlarmFromOnboarding() {
  const prev = activeAlarmId;
  activeAlarmId = 'test';
  if (soundEnabled) playAlarmSound();
  setTimeout(() => { activeAlarmId = prev; }, 3000);
  showToast('Testing alarm sound...');
}

// ============================================
// PERSISTENT FLOATING OVERLAY
// ============================================

function initFloatingOverlay() {
  const overlay = document.getElementById('floatingOverlay');

  // Load saved position
  const savedPos = localStorage.getItem('planAlarm_floatPos');
  if (savedPos) {
    try { floatingPos = JSON.parse(savedPos); } catch (e) {}
  }

  // Load enabled state
  floatingOverlayEnabled = localStorage.getItem('planAlarm_floatEnabled') !== 'false';
  updateOverlayToggleUI();

  if (floatingOverlayEnabled && plans.length > 0) {
    overlay.classList.remove('hidden');
  }

  applyFloatingPosition();
  setupFloatingDrag();
}

function applyFloatingPosition() {
  const overlay = document.getElementById('floatingOverlay');
  // Clamp to viewport
  const maxX = window.innerWidth - 140;
  const maxY = window.innerHeight - 60;
  floatingPos.x = Math.max(0, Math.min(floatingPos.x, maxX));
  floatingPos.y = Math.max(0, Math.min(floatingPos.y, maxY));
  overlay.style.left = floatingPos.x + 'px';
  overlay.style.top = floatingPos.y + 'px';
}

function setupFloatingDrag() {
  const overlay = document.getElementById('floatingOverlay');
  let startX, startY, offsetX, offsetY;
  let hasMoved = false;

  function onStart(e) {
    e.preventDefault();
    floatingDragActive = true;
    hasMoved = false;
    const touch = e.touches ? e.touches[0] : e;
    const rect = overlay.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    overlay.style.transition = 'none';
    overlay.classList.add('dragging');
  }

  function onMove(e) {
    if (!floatingDragActive) return;
    e.preventDefault();
    hasMoved = true;
    const touch = e.touches ? e.touches[0] : e;
    let newX = touch.clientX - offsetX;
    let newY = touch.clientY - offsetY;

    // Clamp
    const maxX = window.innerWidth - overlay.offsetWidth;
    const maxY = window.innerHeight - overlay.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    floatingPos.x = newX;
    floatingPos.y = newY;
    overlay.style.left = newX + 'px';
    overlay.style.top = newY + 'px';
  }

  function onEnd(e) {
    if (!floatingDragActive) return;
    floatingDragActive = false;
    overlay.style.transition = '';
    overlay.classList.remove('dragging');

    // Save position
    localStorage.setItem('planAlarm_floatPos', JSON.stringify(floatingPos));

    // If didn't move, it's a tap -> expand/collapse
    if (!hasMoved) {
      if (floatingExpanded) {
        collapseFloating();
      } else {
        expandFloating();
      }
    }
  }

  // Only attach to the compact header area or the whole compact view
  overlay.addEventListener('mousedown', onStart);
  overlay.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

function expandFloating() {
  floatingExpanded = true;
  document.getElementById('floatingCompact').classList.add('hidden');
  document.getElementById('floatingExpanded').classList.remove('hidden');
  updateFloatingCountdown();
}

function collapseFloating() {
  floatingExpanded = false;
  document.getElementById('floatingExpanded').classList.add('hidden');
  document.getElementById('floatingCompact').classList.remove('hidden');
}

function updateFloatingCountdown() {
  const overlay = document.getElementById('floatingOverlay');
  const nextPlan = getNextPendingPlan();
  const now = new Date();

  // Show/hide based on plans and setting
  if (!floatingOverlayEnabled) {
    overlay.classList.add('hidden');
    return;
  }

  if (!nextPlan) {
    if (!activeAlarmId) {
      overlay.classList.add('hidden');
    }
    return;
  }

  overlay.classList.remove('hidden');

  const targetDate = getPlanDate(nextPlan);
  const diff = targetDate - now;

  if (diff <= 0) {
    // Plan is now or overdue
    const dot = document.getElementById('floatingDot');
    const dotExp = document.getElementById('floatingDotExpanded');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-success animate-ping';
    if (dotExp) dotExp.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-success animate-ping';

    document.getElementById('floatingTime').textContent = 'NOW!';
    document.getElementById('floatingTaskLabel').textContent = truncate(nextPlan.task, 15);

    document.getElementById('cdWeeks').textContent = '0';
    document.getElementById('cdDays').textContent = '0';
    document.getElementById('cdHours').textContent = '0';
    document.getElementById('cdMinutes').textContent = '0';
    document.getElementById('cdSeconds').textContent = '0';

    document.getElementById('floatingTaskName').textContent = nextPlan.task;
    document.getElementById('floatingTaskTime').textContent = formatDisplayTime(nextPlan.time);

    // Show alarm actions in expanded
    document.getElementById('floatingAlarmActions').classList.remove('hidden');

    // Set overlay style to alarming
    overlay.classList.add('floating-alarming');
    return;
  }

  // Normal countdown
  overlay.classList.remove('floating-alarming');
  document.getElementById('floatingAlarmActions').classList.add('hidden');

  const totalSec = Math.floor(diff / 1000);
  const weeks = Math.floor(totalSec / (7 * 24 * 3600));
  const days = Math.floor((totalSec % (7 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  // Color based on urgency
  const totalMinutes = totalSec / 60;
  let colorClass = 'bg-primary'; // default orange
  if (totalMinutes < 5) colorClass = 'bg-danger animate-pulse';
  else if (totalMinutes < 30) colorClass = 'bg-warning';
  else if (totalMinutes < 120) colorClass = 'bg-primary';

  const dot = document.getElementById('floatingDot');
  const dotExp = document.getElementById('floatingDotExpanded');
  if (dot) dot.className = `w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorClass}`;
  if (dotExp) dotExp.className = `w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorClass}`;

  // Compact text
  let compactText = '';
  if (weeks > 0) compactText = `${weeks}w ${days}d`;
  else if (days > 0) compactText = `${days}d ${pad(hours)}:${pad(minutes)}`;
  else if (hours > 0) compactText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  else compactText = `${pad(minutes)}:${pad(seconds)}`;

  document.getElementById('floatingTime').textContent = compactText;
  document.getElementById('floatingTaskLabel').textContent = truncate(nextPlan.task, 15);

  // Expanded
  document.getElementById('cdWeeks').textContent = weeks;
  document.getElementById('cdDays').textContent = days;
  document.getElementById('cdHours').textContent = pad(hours);
  document.getElementById('cdMinutes').textContent = pad(minutes);
  document.getElementById('cdSeconds').textContent = pad(seconds);

  document.getElementById('floatingTaskName').textContent = nextPlan.task;
  document.getElementById('floatingTaskTime').textContent = formatDateWithDay(nextPlan.date) + ' at ' + formatDisplayTime(nextPlan.time);
}

function toggleFloatingOverlay() {
  floatingOverlayEnabled = !floatingOverlayEnabled;
  localStorage.setItem('planAlarm_floatEnabled', floatingOverlayEnabled);
  updateOverlayToggleUI();
  const overlay = document.getElementById('floatingOverlay');
  if (!floatingOverlayEnabled) {
    overlay.classList.add('hidden');
  } else {
    if (plans.length > 0) {
      overlay.classList.remove('hidden');
    }
  }
  showToast(floatingOverlayEnabled ? 'Overlay enabled' : 'Overlay disabled');
}

function updateOverlayToggleUI() {
  const toggle = document.getElementById('overlayToggleBtn');
  const knob = document.getElementById('overlayToggleKnob');
  if (floatingOverlayEnabled) {
    toggle.className = 'w-12 h-7 rounded-full bg-primary relative transition-colors';
    knob.className = 'w-5 h-5 rounded-full bg-white absolute top-1 right-1 transition-all shadow-sm';
  } else {
    toggle.className = 'w-12 h-7 rounded-full bg-surface-lighter relative transition-colors';
    knob.className = 'w-5 h-5 rounded-full bg-gray-400 absolute top-1 left-1 transition-all shadow-sm';
  }
}

// ============================================
// DATE / TIME HELPERS
// ============================================

function formatDateValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeValue(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function truncate(str, len) {
  return str.length > len ? str.substring(0, len) + '...' : str;
}

function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = now.toLocaleDateString('en-US', options);
}

function formatDateWithDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDateForType(type) {
  const now = new Date();
  if (type === 'tomorrow') now.setDate(now.getDate() + 1);
  return formatDateValue(now);
}

function todayStr() {
  return formatDateValue(new Date());
}

function getPlanDate(plan) {
  const [h, m] = plan.time.split(':').map(Number);
  const d = new Date(plan.date + 'T00:00:00');
  d.setHours(h, m, 0, 0);
  return d;
}

function getNextPendingPlan() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Get all future pending plans across all dates
  const pending = plans
    .filter(p => !p.done && !p.dismissed)
    .filter(p => {
      const target = getPlanDate(p);
      return target > now;
    })
    .sort((a, b) => getPlanDate(a) - getPlanDate(b));

  return pending[0] || null;
}

// ============================================
// CLOCK
// ============================================

function updateClock() {
  const now = new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());

  document.getElementById('liveClock').textContent = `${h}:${m}`;
  document.getElementById('clockSeconds').textContent = `:${s}`;

  updateNextUp();
  updateActiveTask();
  updateFloatingCountdown();
}

// ============================================
// STORAGE
// ============================================

function loadPlans() {
  try {
    const data = localStorage.getItem('planAlarm_plans');
    plans = data ? JSON.parse(data) : [];
    processRepeatPlans();
    cleanOldPlans();
  } catch (e) {
    plans = [];
  }
}

function savePlans() {
  localStorage.setItem('planAlarm_plans', JSON.stringify(plans));
}

function loadSettings() {
  soundEnabled = localStorage.getItem('planAlarm_sound') !== 'false';
  updateSoundIcon();
}

function saveSettings() {
  localStorage.setItem('planAlarm_sound', soundEnabled);
}

function processRepeatPlans() {
  const today = todayStr();
  let changed = false;
  plans.forEach(plan => {
    if (plan.repeat && plan.date < today && !plan.done) {
      plan.date = today;
      plan.done = false;
      plan.dismissed = false;
      changed = true;
    }
  });
  if (changed) savePlans();
}

function cleanOldPlans() {
  // Remove non-repeat plans older than 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = formatDateValue(cutoff);
  plans = plans.filter(p => p.repeat || p.date >= cutoffStr);
  savePlans();
}

// ============================================
// PLAN CRUD
// ============================================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function openAddPlan() {
  editingPlanId = null;
  alarmEnabled = true;
  repeatEnabled = false;
  selectedDateType = 'today';
  document.getElementById('modalTitle').textContent = 'Add New Plan';
  document.getElementById('taskInput').value = '';

  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  document.getElementById('timeInput').value = formatTimeValue(nextHour);
  document.getElementById('dateInput').value = formatDateValue(new Date());
  document.getElementById('dateInput').classList.add('hidden');

  updateAlarmToggleUI();
  updateRepeatToggleUI();
  updateDateTypeUI();
  openModal();
  setTimeout(() => document.getElementById('taskInput').focus(), 400);
}

function openEditPlan(id) {
  const plan = plans.find(p => p.id === id);
  if (!plan) return;

  editingPlanId = id;
  alarmEnabled = plan.alarm !== false;
  repeatEnabled = plan.repeat || false;
  selectedDateType = plan.date === todayStr() ? 'today' : plan.date === formatDateValue(new Date(Date.now() + 86400000)) ? 'tomorrow' : 'custom';

  document.getElementById('modalTitle').textContent = 'Edit Plan';
  document.getElementById('taskInput').value = plan.task;
  document.getElementById('timeInput').value = plan.time;

  if (selectedDateType === 'custom') {
    document.getElementById('dateInput').value = plan.date;
    document.getElementById('dateInput').classList.remove('hidden');
  } else {
    document.getElementById('dateInput').value = getDateForType(selectedDateType);
    document.getElementById('dateInput').classList.add('hidden');
  }

  updateAlarmToggleUI();
  updateRepeatToggleUI();
  updateDateTypeUI();
  openModal();
}

function savePlan() {
  const task = document.getElementById('taskInput').value.trim();
  const time = document.getElementById('timeInput').value;

  if (!task) { shakeElement(document.getElementById('taskInput')); return; }
  if (!time) { shakeElement(document.getElementById('timeInput')); return; }

  const date = selectedDateType === 'custom'
    ? document.getElementById('dateInput').value
    : getDateForType(selectedDateType);

  if (!date) { shakeElement(document.getElementById('dateInput')); return; }

  if (editingPlanId) {
    const idx = plans.findIndex(p => p.id === editingPlanId);
    if (idx !== -1) {
      plans[idx].task = task;
      plans[idx].time = time;
      plans[idx].date = date;
      plans[idx].alarm = alarmEnabled;
      plans[idx].repeat = repeatEnabled;
    }
  } else {
    plans.push({
      id: generateId(), task, time, date,
      alarm: alarmEnabled, repeat: repeatEnabled,
      done: false, dismissed: false,
      createdAt: Date.now()
    });
  }

  savePlans();
  closeModal();
  renderPlans();
  updateFloatingCountdown();
  showToast(editingPlanId ? 'Plan updated' : 'Plan added');
}

function deletePlan(id) {
  plans = plans.filter(p => p.id !== id);
  savePlans();
  renderPlans();
  updateFloatingCountdown();
  showToast('Plan deleted');
}

function toggleDone(id) {
  const plan = plans.find(p => p.id === id);
  if (plan) {
    plan.done = !plan.done;
    if (plan.done) plan.dismissed = true;
    savePlans();
    renderPlans();
    updateFloatingCountdown();
    showToast(plan.done ? 'Completed!' : 'Marked as pending');
  }
}

// ============================================
// RENDERING
// ============================================

function renderPlans() {
  const container = document.getElementById('plansList');
  const emptyState = document.getElementById('emptyState');
  const progressSection = document.getElementById('progressSection');
  const today = todayStr();

  let filtered = plans.filter(p => p.date === today);
  if (currentFilter === 'pending') filtered = filtered.filter(p => !p.done);
  else if (currentFilter === 'done') filtered = filtered.filter(p => p.done);
  filtered.sort((a, b) => a.time.localeCompare(b.time));

  const todayPlans = plans.filter(p => p.date === today);
  const doneCount = todayPlans.filter(p => p.done).length;
  const totalCount = todayPlans.length;

  document.getElementById('planCount').textContent = `(${filtered.length})`;

  if (totalCount > 0) {
    progressSection.classList.remove('hidden');
    document.getElementById('progressText').textContent = `${doneCount}/${totalCount}`;
    document.getElementById('progressBar').style.width = `${(doneCount / totalCount) * 100}%`;
  } else {
    progressSection.classList.add('hidden');
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  container.innerHTML = filtered.map(plan => {
    const [h, m] = plan.time.split(':').map(Number);
    const planMinutes = h * 60 + m;
    const isPast = planMinutes < currentMinutes && !plan.done;
    const isActive = !plan.done && !plan.dismissed && planMinutes <= currentMinutes && planMinutes >= currentMinutes - 5;
    const targetDate = getPlanDate(plan);
    const diff = targetDate - now;
    const totalSec = Math.floor(diff / 1000);

    let countdownStr = '';
    if (!plan.done && diff > 0) {
      const w = Math.floor(totalSec / (7*24*3600));
      const d = Math.floor((totalSec % (7*24*3600)) / (24*3600));
      const hr = Math.floor((totalSec % (24*3600)) / 3600);
      const min = Math.floor((totalSec % 3600) / 60);
      if (w > 0) countdownStr = `${w}w ${d}d left`;
      else if (d > 0) countdownStr = `${d}d ${hr}h left`;
      else if (hr > 0) countdownStr = `${hr}h ${min}m left`;
      else countdownStr = `${min}m left`;
    } else if (isPast && !plan.done) {
      countdownStr = 'OVERDUE';
    }

    return `
      <div class="group bg-surface rounded-2xl p-4 transition-all duration-200 hover:bg-surface-lighter ${plan.done ? 'opacity-50' : ''} ${isActive ? 'ring-1 ring-success/30' : ''}">
        <div class="flex items-start gap-3">
          <button onclick="toggleDone('${plan.id}')" class="mt-0.5 flex-shrink-0">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${plan.done ? 'bg-success border-success' : 'border-gray-500 hover:border-primary'}">
              ${plan.done ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
            </div>
          </button>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-semibold ${plan.done ? 'line-through text-gray-500' : 'text-white'} truncate">${escapeHtml(plan.task)}</p>
              ${plan.repeat ? '<span class="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">DAILY</span>' : ''}
              ${plan.alarm ? '<span class="flex-shrink-0"><svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>' : ''}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm ${isPast ? 'text-danger' : 'text-gray-400'}">${formatDisplayTime(plan.time)}</span>
              ${isPast ? '<span class="text-[10px] text-danger font-medium">OVERDUE</span>' : ''}
              ${isActive ? '<span class="text-[10px] text-success font-medium animate-pulse">NOW</span>' : ''}
              ${!plan.done && countdownStr ? `<span class="text-[10px] text-gray-500 ml-auto">${countdownStr}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button onclick="openEditPlan('${plan.id}')" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
              <svg class="w-4 h-4 text-gray-500 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button onclick="confirmDelete('${plan.id}')" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-danger/10 transition-colors">
              <svg class="w-4 h-4 text-gray-500 hover:text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function formatDisplayTime(time) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${pad(m)} ${ampm}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// NEXT UP / ACTIVE TASK
// ============================================

function updateNextUp() {
  const nextUpSection = document.getElementById('nextUpSection');
  const allDoneSection = document.getElementById('allDoneSection');
  const today = todayStr();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayPending = plans
    .filter(p => p.date === today && !p.done && !p.dismissed)
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextPlan = todayPending.find(p => {
    const [h, m] = p.time.split(':').map(Number);
    return h * 60 + m > currentMinutes;
  });

  const currentPlan = todayPending.find(p => {
    const [h, m] = p.time.split(':').map(Number);
    return h * 60 + m <= currentMinutes && h * 60 + m >= currentMinutes - 5;
  });

  if (currentPlan) {
    nextUpSection.classList.add('hidden');
    allDoneSection.classList.add('hidden');
    return;
  }

  if (nextPlan) {
    nextUpSection.classList.remove('hidden');
    allDoneSection.classList.add('hidden');

    document.getElementById('nextUpTask').textContent = nextPlan.task;
    document.getElementById('nextUpTime').textContent = formatDisplayTime(nextPlan.time);

    const target = getPlanDate(nextPlan);
    const diff = target - now;
    const totalSec = Math.floor(diff / 1000);
    const hr = Math.floor(totalSec / 3600);
    const min = Math.floor((totalSec % 3600) / 60);
    const sec = totalSec % 60;

    document.getElementById('nextUpCountdown').textContent = `${pad(hr)}:${pad(min)}:${pad(sec)}`;
  } else {
    nextUpSection.classList.add('hidden');
    const allDone = todayPending.length === 0;
    if (allDone) allDoneSection.classList.remove('hidden');
    else allDoneSection.classList.add('hidden');
  }
}

function updateActiveTask() {
  const section = document.getElementById('activeTaskSection');
  const today = todayStr();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const activePlan = plans.find(p => {
    if (p.date !== today || p.done || p.dismissed) return false;
    const [h, m] = p.time.split(':').map(Number);
    return h * 60 + m <= currentMinutes && h * 60 + m >= currentMinutes - 5;
  });

  if (activePlan) {
    section.classList.remove('hidden');
    document.getElementById('activeTaskName').textContent = activePlan.task;
    document.getElementById('activeTaskTime').textContent = formatDisplayTime(activePlan.time);
  } else {
    section.classList.add('hidden');
  }
}

// ============================================
// ALARM SYSTEM
// ============================================

function checkAlarms() {
  if (activeAlarmId) return;

  const today = todayStr();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  plans.forEach(plan => {
    if (plan.date !== today || plan.done || plan.dismissed || !plan.alarm) return;
    const [h, m] = plan.time.split(':').map(Number);
    if (h === now.getHours() && m === now.getMinutes() && currentSeconds < 2) {
      triggerAlarm(plan);
    }
  });
}

function triggerAlarm(plan) {
  activeAlarmId = plan.id;

  // Fullscreen overlay
  const overlay = document.getElementById('alarmOverlay');
  document.getElementById('alarmOverlayTask').textContent = plan.task;
  document.getElementById('alarmOverlayTime').textContent = formatDisplayTime(plan.time);
  overlay.classList.remove('hidden');

  // Expand floating to show actions
  expandFloating();

  if (soundEnabled) playAlarmSound();

  // Persistent notification
  sendNotification('PlanAlarm', `TIME TO: ${plan.task}`);

  // Vibrate
  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
}

function playAlarmSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playAlarmSequence();
  } catch (e) {}
}

function playAlarmSequence() {
  if (!activeAlarmId || !soundEnabled) return;
  const now = audioCtx.currentTime;
  for (let cycle = 0; cycle < 4; cycle++) {
    const base = now + cycle * 1.0;
    createBeep(base, 880, 0.12);
    createBeep(base + 0.15, 1100, 0.12);
    createBeep(base + 0.3, 1320, 0.18);
  }
  setTimeout(() => {
    if (activeAlarmId && soundEnabled) playAlarmSequence();
  }, 3500);
}

function createBeep(startTime, freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.35, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function dismissAlarm() {
  if (!activeAlarmId) return;
  const plan = plans.find(p => p.id === activeAlarmId);
  if (plan) {
    plan.done = true;
    plan.dismissed = true;
    savePlans();
  }
  stopAlarm();
  collapseFloating();
  renderPlans();
  updateFloatingCountdown();
  showToast('Marked as done!');
}

function snoozeAlarm() {
  if (!activeAlarmId) return;
  const plan = plans.find(p => p.id === activeAlarmId);
  if (plan) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    plan.time = formatTimeValue(now);
    plan.dismissed = false;
    savePlans();
  }
  stopAlarm();
  collapseFloating();
  renderPlans();
  updateFloatingCountdown();
  showToast('Snoozed for 5 minutes');
}

function stopAlarm() {
  activeAlarmId = null;
  document.getElementById('alarmOverlay').classList.add('hidden');
  if (navigator.vibrate) navigator.vibrate(0);
}

function testAlarmSound() {
  const prev = activeAlarmId;
  activeAlarmId = 'test';
  if (soundEnabled) playAlarmSound();
  setTimeout(() => { activeAlarmId = prev; }, 3000);
  showToast('Testing alarm sound...');
}

// ============================================
// NOTIFICATIONS
// ============================================

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported');
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      showToast('Notifications enabled!');
      new Notification('PlanAlarm', {
        body: 'Notifications active! You will be reminded at plan time.',
        icon: 'icon.png',
      });
    } else {
      showToast('Notifications denied');
    }
    updateNotifStatus();
  } catch (e) {
    showToast('Could not request permission');
  }
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: 'icon.png',
        badge: 'icon.png',
        tag: 'plan-alarm',
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200],
        silent: false,
      });
      notif.onclick = () => { window.focus(); notif.close(); };
    } catch (e) {}
  }
}

function updateNotifStatus() {
  const el = document.getElementById('notifStatus');
  if (!('Notification' in window)) {
    el.textContent = 'Not supported';
  } else if (Notification.permission === 'granted') {
    el.textContent = 'Enabled';
    el.classList.add('text-success');
  } else if (Notification.permission === 'denied') {
    el.textContent = 'Blocked';
  } else {
    el.textContent = 'Tap Enable';
  }
}

// ============================================
// FILTER
// ============================================

function filterPlans(type) {
  currentFilter = type;
  renderPlans();
  ['All', 'Pending', 'Done'].forEach(f => {
    const btn = document.getElementById('filter' + f);
    if (f.toLowerCase() === type) {
      btn.className = 'text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium transition-colors';
    } else {
      btn.className = 'text-xs px-3 py-1 rounded-full bg-surface text-gray-400 font-medium transition-colors';
    }
  });
}

// ============================================
// SOUND TOGGLE
// ============================================

function toggleSound() {
  soundEnabled = !soundEnabled;
  saveSettings();
  updateSoundIcon();
  showToast(soundEnabled ? 'Sound on' : 'Sound off');
}

function updateSoundIcon() {
  document.getElementById('soundOnIcon').classList.toggle('hidden', !soundEnabled);
  document.getElementById('soundOffIcon').classList.toggle('hidden', soundEnabled);
}

// ============================================
// MODALS
// ============================================

function openModal() {
  document.getElementById('planModal').classList.remove('hidden');
  requestAnimationFrame(() => {
    document.getElementById('modalContent').style.transform = 'translateY(0)';
  });
}

function closeModal() {
  document.getElementById('modalContent').style.transform = 'translateY(100%)';
  setTimeout(() => {
    document.getElementById('planModal').classList.add('hidden');
    editingPlanId = null;
  }, 300);
}

function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden');
  updateNotifStatus();
  requestAnimationFrame(() => {
    document.getElementById('settingsContent').style.transform = 'translateY(0)';
  });
}

function closeSettings() {
  document.getElementById('settingsContent').style.transform = 'translateY(100%)';
  setTimeout(() => {
    document.getElementById('settingsModal').classList.add('hidden');
  }, 300);
}

// ============================================
// FORM HELPERS
// ============================================

function toggleAlarmInForm() {
  alarmEnabled = !alarmEnabled;
  updateAlarmToggleUI();
}

function updateAlarmToggleUI() {
  const t = document.getElementById('alarmToggle');
  const k = document.getElementById('alarmToggleKnob');
  if (alarmEnabled) {
    t.className = 'w-12 h-7 rounded-full bg-primary relative transition-colors';
    k.className = 'w-5 h-5 rounded-full bg-white absolute top-1 right-1 transition-all shadow-sm';
  } else {
    t.className = 'w-12 h-7 rounded-full bg-surface-lighter relative transition-colors';
    k.className = 'w-5 h-5 rounded-full bg-gray-400 absolute top-1 left-1 transition-all shadow-sm';
  }
}

function toggleRepeat() {
  repeatEnabled = !repeatEnabled;
  updateRepeatToggleUI();
}

function updateRepeatToggleUI() {
  const t = document.getElementById('repeatToggle');
  const k = document.getElementById('repeatToggleKnob');
  if (repeatEnabled) {
    t.className = 'w-12 h-7 rounded-full bg-primary relative transition-colors';
    k.className = 'w-5 h-5 rounded-full bg-white absolute top-1 right-1 transition-all shadow-sm';
  } else {
    t.className = 'w-12 h-7 rounded-full bg-surface-lighter relative transition-colors';
    k.className = 'w-5 h-5 rounded-full bg-gray-400 absolute top-1 left-1 transition-all shadow-sm';
  }
}

function selectDateType(type) {
  selectedDateType = type;
  updateDateTypeUI();
  if (type === 'custom') {
    document.getElementById('dateInput').classList.remove('hidden');
  } else {
    document.getElementById('dateInput').classList.add('hidden');
  }
}

function updateDateTypeUI() {
  ['Today', 'Tomorrow', 'Custom'].forEach(d => {
    const btn = document.getElementById('date' + d);
    const isActive = d.toLowerCase() === selectedDateType;
    btn.className = `flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-surface text-gray-400'}`;
  });
}

// ============================================
// DELETE / CLEAR
// ============================================

function confirmDelete(id) {
  const plan = plans.find(p => p.id === id);
  if (!plan) return;
  if (confirm(`Delete "${plan.task}"?`)) deletePlan(id);
}

function clearAllPlans() {
  if (confirm('Delete ALL plans? This cannot be undone.')) {
    plans = [];
    savePlans();
    renderPlans();
    updateFloatingCountdown();
    showToast('All plans cleared');
  }
}

// ============================================
// TOAST
// ============================================

function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'fixed top-4 left-1/2 z-[9999] bg-surface-lighter text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl border border-white/10';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.2s ease-in forwards';
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}

function shakeElement(el) {
  el.style.animation = 'shake 0.4s ease-in-out';
  el.classList.add('border-danger');
  setTimeout(() => { el.style.animation = ''; el.classList.remove('border-danger'); }, 500);
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Keep screen awake if possible
if ('wakeLock' in navigator) {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      try { await navigator.wakeLock.request('screen'); } catch(e) {}
    }
  });
}
