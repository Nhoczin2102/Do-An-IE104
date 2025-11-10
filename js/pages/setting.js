// ../js/pages/setting.js

// ===== Mock settings =====
const settings = {
  account: { displayName: "Người dùng PotPan", email: "user@example.com", linkedProviders: ["google"] },
  locale: { language: "vi", unit: "metric", timeFormat: "24h" },
  preferences: { dietary: ["none"], allergies: ["peanut", "shellfish"], dislikes: [], cuisines: ["vietnamese", "thai", "japanese"], spiceLevel: 2 },
  notifications: { enabled: true, mealReminders: true, newRecipes: true, savedRecipeUpdates: true, channels: { push: true, email: false } },
  downloads: { offlineEnabled: true, wifiOnly: true, imageQuality: "standard", cacheBytes: 125 * 1024 * 1024 },
  privacy: { personalization: true, analytics: true },
  cookingAssist: { keepScreenOn: true, handsFree: false, autoTimers: true },
  diagnostics: { appVersion: "PotPan 2.1.3 (Build 145)" }
};

// ===== State =====
let currentView = "grid";           // 'grid' | 'detail'
let currentDetailSection = "";

// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const byId = (id) => document.getElementById(id);
const setIf = (id, fn) => { const el = byId(id); if (el) fn(el); }; // guard setter

const safeText = (el) => (el?.textContent || "").trim();
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024, dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// ===== Boot =====
document.addEventListener("DOMContentLoaded", () => {
  initializeSettings();
  setupEventListeners();
  setupNavigation();
  showGridView(); // mặc định
});

// ===== Initial fill =====
function initializeSettings() {
  setIf("display-name", (el) => (el.value = settings.account.displayName));
  setIf("user-email", (el) => (el.textContent = settings.account.email));
  setIf("language", (el) => (el.value = settings.locale.language));

  // Những control có thể chưa tồn tại trong HTML hiện tại → có guard
  setIf("unit-system", (el) => (el.value = settings.locale.unit));
  setIf("time-format", (el) => (el.value = settings.locale.timeFormat));

  setIf("dietary-mode", (el) => (el.value = settings.preferences.dietary[0] || "none"));
  setIf("spice-level", (el) => (el.value = String(settings.preferences.spiceLevel)));

  setIf("notifications-enabled", (el) => (el.checked = !!settings.notifications.enabled));
  setIf("meal-reminders", (el) => (el.checked = !!settings.notifications.mealReminders));
  setIf("new-recipes", (el) => (el.checked = !!settings.notifications.newRecipes));
  setIf("saved-recipe-updates", (el) => (el.checked = !!settings.notifications.savedRecipeUpdates));

  setIf("offline-enabled", (el) => (el.checked = !!settings.downloads.offlineEnabled));
  setIf("wifi-only", (el) => (el.checked = !!settings.downloads.wifiOnly));
  setIf("image-quality", (el) => (el.value = settings.downloads.imageQuality));

  setIf("keep-screen-on", (el) => (el.checked = !!settings.cookingAssist.keepScreenOn));
  setIf("hands-free", (el) => (el.checked = !!settings.cookingAssist.handsFree));
  setIf("auto-timers", (el) => (el.checked = !!settings.cookingAssist.autoTimers));

  setIf("personalization", (el) => (el.checked = !!settings.privacy.personalization));
  setIf("analytics", (el) => (el.checked = !!settings.privacy.analytics));

  setIf("app-version", (el) => (el.textContent = settings.diagnostics.appVersion));
  setIf("cache-size", (el) => (el.textContent = formatBytes(settings.downloads.cacheBytes)));

  setIf("user-avatar", (el) => (el.textContent = (settings.account.displayName || "U").charAt(0).toUpperCase()));
}

// ===== Global listeners for GRID controls =====
function setupEventListeners() {
  setIf("manage-allergies", (el) => el.addEventListener("click", openAllergiesModal));
  setIf("manage-cuisines", (el) => el.addEventListener("click", openCuisinesModal));
  setIf("clear-cache", (el) => el.addEventListener("click", clearCache));
  setIf("export-data", (el) => el.addEventListener("click", exportData));
  setIf("delete-account", (el) => el.addEventListener("click", deleteAccount));
  setIf("change-avatar", (el) => el.addEventListener("click", changeAvatar));
  setIf("change-password", (el) => el.addEventListener("click", changePassword));

  // Modal setup (chips & save)
  setupModal("allergies-modal", "allergies-chips", settings.preferences.allergies);
  setupModal("cuisines-modal", "cuisines-chips", settings.preferences.cuisines);

  // Search: khi đang ở detail → tự quay lại grid rồi lọc
  setIf("search-settings", (el) =>
    el.addEventListener("input", () => {
      if (currentView !== "grid") showGridView();
      searchSettings();
    })
  );

  // Realtime changes (guard theo phần tử)
  setIf("display-name", (el) => el.addEventListener("change", updateDisplayName));
  setIf("language", (el) => el.addEventListener("change", updateLanguage));
  setIf("unit-system", (el) => el.addEventListener("change", updateUnitSystem));
  setIf("time-format", (el) => el.addEventListener("change", updateTimeFormat));
  setIf("dietary-mode", (el) => el.addEventListener("change", updateDietaryMode));
  setIf("spice-level", (el) => el.addEventListener("change", updateSpiceLevel));

  // All toggles
  $$('input[type="checkbox"]').forEach((cb) => cb.addEventListener("change", handleToggleChange));
}

// ===== Sidebar navigation → Detail view =====
function setupNavigation() {
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionName = safeText(item.querySelector("span:last-child"));
      if (!sectionName) return;
      showSectionDetail(sectionName);
    });
  });
}

function showGridView() {
  currentView = "grid";
  const grid = $(".settings-grid");
  if (grid) grid.style.display = "grid";

  const detail = $(".settings-detail");
  if (detail) detail.remove();

  // remove active state in sidebar
  $$(".nav-item").forEach((i) => i.classList.remove("active"));
}

function showSectionDetail(sectionName) {
  currentView = "detail";
  currentDetailSection = sectionName;

  const grid = $(".settings-grid");
  if (grid) grid.style.display = "none";

  const oldDetail = $(".settings-detail");
  if (oldDetail) oldDetail.remove();

  const detail = document.createElement("div");
  detail.className = "settings-detail";
  detail.innerHTML = `
    <div class="detail-header">
      <button class="back-button"><i class="fas fa-arrow-left"></i> Quay lại</button>
      <h2 class="section-title">${sectionName}</h2>
      <span class="section-icon">${getSectionIcon(sectionName)}</span>
    </div>
    <div class="detail-content">
      ${getSectionContent(sectionName)}
    </div>
  `;

  const main = $(".main-content");
  const searchBox = $(".search-box");
  main.insertBefore(detail, searchBox.nextSibling);

  // Sidebar active
  $$(".nav-item").forEach((i) => {
    i.classList.toggle("active", safeText(i.querySelector("span:last-child")) === sectionName);
  });

  // Back button
  $(".back-button", detail)?.addEventListener("click", showGridView);

  // Listeners inside detail (per section)
  setupDetailEventListeners(sectionName, detail);
}

// listeners specific cho nội dung detail
function setupDetailEventListeners(sectionName, scope = document) {
  switch (sectionName) {
    case "Hồ sơ & Bảo mật": {
      const twoFactor = $("#two-factor-toggle", scope);
      if (twoFactor) {
        twoFactor.addEventListener("change", () => showNotification("Đã cập nhật bảo mật hai lớp!"));
      }
      break;
    }
    case "Thông báo": {
      $$(".notification-detail-toggle", scope).forEach((t) =>
        t.addEventListener("change", () => showNotification("Đã cập nhật cài đặt thông báo!"))
      );
      break;
    }
    default:
      break;
  }
}

// ===== Section content & icons =====
function getSectionIcon(sectionName) {
  const iconMap = {
    "Hồ sơ & Bảo mật": "👤",
    "Thông báo": "🔔",
    "Ngôn ngữ & Vùng": "🌐",
    "Sở thích ăn uống": "🍽️",
    "Trợ lý nấu ăn": "👨‍🍳",
    "Trợ năng": "📱",
    "Tải xuống & Bộ nhớ": "📥",
    "Đồng bộ & Sao lưu": "☁️",
    "Trợ giúp & FAQ": "❓",
    "Gửi phản hồi": "📝",
    "Quyền riêng tư & Pháp lý": "🔒"
  };
  return iconMap[sectionName] || "⚙️";
}


// ===== Modals =====
function openAllergiesModal() { byId("allergies-modal").style.display = "flex"; }
function openCuisinesModal() { byId("cuisines-modal").style.display = "flex"; }

function setupModal(modalId, chipsContainerId, selectedValues) {
  const modal = byId(modalId);
  if (!modal) return;

  const chipsContainer = byId(chipsContainerId);
  const closeButtons = modal.querySelectorAll(".close-modal, .secondary");
  const saveButton = modal.querySelector("button:not(.secondary)");

  if (chipsContainer) {
    $$(".chip", chipsContainer).forEach((chip) => {
      if (selectedValues.includes(chip.dataset.value)) chip.classList.add("active");
      chip.addEventListener("click", function () { this.classList.toggle("active"); });
    });
  }

  closeButtons.forEach((btn) => btn.addEventListener("click", () => (modal.style.display = "none")));

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const actives = chipsContainer ? $$(".chip.active", chipsContainer) : [];
      const nextValues = actives.map((c) => c.dataset.value);

      if (modalId === "allergies-modal") {
        settings.preferences.allergies = nextValues;
        showNotification("Đã cập nhật tùy chọn dị ứng!");
      } else if (modalId === "cuisines-modal") {
        settings.preferences.cuisines = nextValues;
        showNotification("Đã cập nhật ẩm thực yêu thích!");
      }
      modal.style.display = "none";
    });
  }

  // click outside to close
  window.addEventListener("click", function onWinClick(e) {
    if (e.target === modal) modal.style.display = "none";
  });
}

// ===== Actions =====
function clearCache() {
  if (confirm("Bạn có chắc muốn xoá bộ nhớ cache? Thao tác này không thể hoàn tác.")) {
    settings.downloads.cacheBytes = 0;
    setIf("cache-size", (el) => (el.textContent = "0 Bytes"));
    showNotification("Đã xoá bộ nhớ cache thành công!");
  }
}
function exportData() { showNotification("Đã nhận yêu cầu xuất dữ liệu. Chúng tôi sẽ gửi email khi sẵn sàng."); }
function deleteAccount() {
  if (!confirm("Bạn có chắc muốn xoá tài khoản? Tất cả dữ liệu của bạn sẽ bị xoá vĩnh viễn.")) return;
  if (!confirm('Đây là hành động không thể hoàn tác. Nhập "DELETE" để xác nhận:')) return;
  const input = prompt('Nhập "DELETE" để xác nhận xoá tài khoản:');
  if (input === "DELETE") showNotification("Tài khoản của bạn sẽ bị xoá trong vòng 24 giờ. Chúng tôi sẽ gửi email xác nhận.");
  else showNotification("Xoá tài khoản đã bị hủy.");
}
function changeAvatar() { showNotification("Tính năng thay đổi avatar sẽ được cập nhật trong phiên bản tiếp theo!"); }
function changePassword() { showNotification("Tính năng đổi mật khẩu sẽ được cập nhật trong phiên bản tiếp theo!"); }

// ===== Search (Grid only) =====
function searchSettings() {
  const term = (byId("search-settings")?.value || "").toLowerCase();
  // chỉ lọc trong grid
  if (currentView !== "grid") return;
  $$(".settings-section").forEach((sec) => {
    const ok = sec.textContent.toLowerCase().includes(term);
    sec.style.display = ok ? "block" : "none";
  });
  // nếu rỗng → show lại block cho tất cả
  if (!term) $$(".settings-section").forEach((sec) => (sec.style.display = "block"));
}

// ===== Realtime update handlers =====
function updateDisplayName() {
  const v = byId("display-name")?.value || "U";
  settings.account.displayName = v;
  setIf("user-avatar", (el) => (el.textContent = v.charAt(0).toUpperCase()));
  showNotification("Đã cập nhật tên hiển thị!");
}
function updateLanguage() {
  const v = byId("language")?.value;
  if (!v) return;
  settings.locale.language = v;
  showNotification("Đã cập nhật ngôn ngữ!");
}
function updateUnitSystem() {
  const v = byId("unit-system")?.value;
  if (!v) return;
  settings.locale.unit = v;
  showNotification("Đã cập nhật đơn vị đo lường!");
}
function updateTimeFormat() {
  const v = byId("time-format")?.value;
  if (!v) return;
  settings.locale.timeFormat = v;
  showNotification("Đã cập nhật định dạng thời gian!");
}
function updateDietaryMode() {
  const v = byId("dietary-mode")?.value || "none";
  settings.preferences.dietary = [v];
  showNotification("Đã cập nhật chế độ ăn!");
}
function updateSpiceLevel() {
  const v = parseInt(byId("spice-level")?.value || "0", 10);
  settings.preferences.spiceLevel = v;
  showNotification("Đã cập nhật mức độ cay!");
}

function handleToggleChange(e) {
  const id = e.target.id;
  const checked = !!e.target.checked;
  switch (id) {
    case "notifications-enabled": settings.notifications.enabled = checked; break;
    case "meal-reminders": settings.notifications.mealReminders = checked; break;
    case "new-recipes": settings.notifications.newRecipes = checked; break;
    case "saved-recipe-updates": settings.notifications.savedRecipeUpdates = checked; break;
    case "offline-enabled": settings.downloads.offlineEnabled = checked; break;
    case "wifi-only": settings.downloads.wifiOnly = checked; break;
    case "keep-screen-on": settings.cookingAssist.keepScreenOn = checked; break;
    case "hands-free": settings.cookingAssist.handsFree = checked; break;
    case "auto-timers": settings.cookingAssist.autoTimers = checked; break;
    case "personalization": settings.privacy.personalization = checked; break;
    case "analytics": settings.privacy.analytics = checked; break;
    default: break;
  }
  showNotification("Đã cập nhật cài đặt!");
}

// ===== Toast =====
function showNotification(message) {
  const n = document.createElement("div");
  n.style.cssText = `
    position:fixed;top:20px;right:20px;background:var(--primary-color);
    color:#fff;padding:12px 20px;border-radius:6px;box-shadow:var(--shadow);
    z-index:1001;animation:slideInRight .3s ease;
  `;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "slideOutRight .3s ease";
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

// Inject keyframes (chỉ 1 lần)
(() => {
  if (document.getElementById("settings-inline-anim")) return;
  const style = document.createElement("style");
  style.id = "settings-inline-anim";
  style.textContent = `
    @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  `;
  document.head.appendChild(style);
})();
