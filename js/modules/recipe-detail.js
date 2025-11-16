// recipe-detail.js
import { CookMode } from './cookMode.js';

class RecipeDetail {
    constructor() {
        this.qs = new URLSearchParams(window.location.search);
        this.id = Number(this.qs.get("id"));
        this.srcParam = (this.qs.get("src") || "").toLowerCase();
        this.returnUrl = this.qs.get("return");
        this.recipeData = null;
        this.cookMode = null;
        
        this.init();
    }

    async init() {
        this.cacheElements();
        await this.initializeCookMode();
        this.bindEvents();
        this.load();
    }

    cacheElements() {
        this.elements = {
            img: document.getElementById("recipe-img"),
            name: document.getElementById("recipe-name"),
            chef: document.getElementById("recipe-chef"),
            time: document.getElementById("recipe-time"),
            tags: document.getElementById("recipe-tags"),
            ingredients: document.getElementById("ingredients"),
            steps: document.getElementById("steps"),
            nutrition: document.getElementById("nutrition"),
            backBtn: document.getElementById("back-link"),
            cookModeBtn: document.getElementById("cookModeBtn")
        };
    }

    async initializeCookMode() {
        try {
            this.cookMode = new CookMode();
            console.log('🍳 Cook Mode initialized for recipe detail');
        } catch (error) {
            console.error('❌ Failed to initialize Cook Mode:', error);
        }
    }

    bindEvents() {
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener("click", (e) => this.handleBackClick(e));
        }

        if (this.elements.cookModeBtn) {
            this.elements.cookModeBtn.addEventListener("click", () => this.openCookMode());
        }
    }

    bucketOf(idNum) {
        if (idNum >= 101 && idNum <= 199) return "all";
        if (idNum >= 201 && idNum <= 299) return "trending";
        if (idNum >= 301 && idNum <= 399) return "saved";
        return "unknown";
    }

    safeSameOriginReferrer() {
        try {
            return document.referrer && new URL(document.referrer).origin === location.origin;
        } catch { 
            return false; 
        }
    }

  function fallbackBySrc() {
    const src = ["trending","saved","all"].includes(srcParam) ? srcParam : bucketOf(id);
    if (src === "saved")    return "../../pages/myRecipe.html";
    if (src === "trending") return "../../pages/explore.html#trending";
    if (src === "all")      return "../../pages/explore.html#all";
    return "../explore.html";
  }

    async getJson(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch fail: " + url);
        return res.json();
    }

  async function load() {
    const details = await getJson("../../js/data/recipe-details.data.json");
    const d = Array.isArray(details) ? details.find(x => Number(x.id) === id) : null;
    if (!d) throw new Error("Không tìm thấy công thức id=" + id);

    render(d);

    const main = ["trending","saved","all"].includes(srcParam) ? srcParam : bucketOf(id);
    const badges = [];
    if (badges.length) {
      tagsEl && tagsEl.insertAdjacentHTML("afterbegin", badges.join(" "));
    }
  }

  function render(d) {
    const name = d.name || "Công thức";
    if (nameH1) nameH1.textContent = name;
    if (nameH2) nameH2.textContent = name;

        if (this.elements.img) {
            this.elements.img.src = d.img || "../../images/placeholder/recipe.png";
            this.elements.img.alt = name;
        }

        if (this.elements.chef) this.elements.chef.textContent = d.chef ? `Đầu bếp: ${d.chef}` : "";
        if (this.elements.time) this.elements.time.textContent = d.time ? `• ${d.time}` : "";

        if (this.elements.tags) {
            this.elements.tags.insertAdjacentHTML(
                "beforeend",
                (d.tags || []).map(t => `<span class="recipe-detail__tag">${t}</span>`).join("")
            );
        }

        if (this.elements.ingredients) {
            const ing = d.ingredients || [];
            const ingHtml = Array.isArray(ing) && typeof ing[0] === "string"
                ? `<ul>${ing.map(i => `<li>${i}</li>`).join("")}</ul>`
                : (Array.isArray(ing)
                    ? ing.map(g => `
                        <div class="recipe-detail__ingredient-group">
                          ${g.title ? `<h4>${g.title}</h4>` : ""}
                          <ul>${(g.items||[]).map(i => `<li>${i}</li>`).join("")}</ul>
                        </div>`).join("")
                    : "");
            this.elements.ingredients.innerHTML = ingHtml || `<li>Đang cập nhật...</li>`;
        }

        if (this.elements.steps) {
            this.elements.steps.innerHTML = (d.steps || []).length
                ? d.steps.map(s => {
                    const text = (typeof s === "string") ? s : s.text;
                    const tip = (typeof s === "object" && s.tip) ? `<div class="recipe-detail__step-tip">Mẹo: ${s.tip}</div>` : "";
                    return `<li><div class="recipe-detail__step-line">${text}</div>${tip}</li>`;
                }).join("")
                : `<li>Đang cập nhật...</li>`;
        }

        if (this.elements.nutrition) {
            const n = d.nutrition || {};
            const nutritionItems = Object.keys(n).map(k => `<li><strong>${k}:</strong> ${n[k]}</li>`).join("");
            this.elements.nutrition.innerHTML = nutritionItems || `<li>Đang cập nhật...</li>`;
        }
    }

    updateCookModeButton() {
        if (!this.elements.cookModeBtn || !this.recipeData) return;
        
        // Enable button if recipe has steps
        const hasSteps = this.recipeData.steps && this.recipeData.steps.length > 0;
        if (!hasSteps) {
            this.elements.cookModeBtn.disabled = true;
            this.elements.cookModeBtn.title = "Công thức này không có bước thực hiện";
            this.elements.cookModeBtn.style.opacity = "0.6";
        }
    }

    openCookMode() {
        console.log('🍳 Opening Cook Mode...');
        
        if (!this.cookMode) {
            console.error('Cook Mode is not initialized');
            alert('Cook Mode chưa sẵn sàng. Vui lòng thử lại sau.');
            return;
        }

        if (!this.recipeData) {
            alert('Không thể tải dữ liệu công thức');
            return;
        }

        // Kiểm tra method tồn tại
        if (typeof this.cookMode.openFromRecipeDetail !== 'function') {
            console.error('openFromRecipeDetail method not found in CookMode');
            alert('Tính năng Cook Mode chưa khả dụng.');
            return;
        }

        const cookModeData = this.convertToCookModeFormat(this.recipeData);
        console.log('📋 Cook Mode data:', cookModeData);
        
        this.cookMode.openFromRecipeDetail(cookModeData);
    }

    convertToCookModeFormat(recipeData) {
        return {
            title: recipeData.name || 'Công thức',
            ingredients: this.extractIngredients(recipeData.ingredients),
            steps: this.extractSteps(recipeData.steps),
            meta: {
                prep: '--', // Ẩn thời gian chuẩn bị
                cook: '--', // Ẩn thời gian nấu
                servings: '--', // Ẩn khẩu phần ăn
                difficulty: '--' // Ẩn độ khó
            },
            tips: this.extractTips(recipeData.steps) || ''
        };
    }

    extractIngredients(ingredients) {
        if (!ingredients) return [];
        
        if (Array.isArray(ingredients)) {
            return ingredients.flatMap(item => {
                if (typeof item === 'string') return item;
                if (item.items && Array.isArray(item.items)) return item.items;
                return String(item);
            }).filter(item => item && item.trim());
        }
        return [];
    }

    extractSteps(steps) {
        if (!steps) return [];
        
        if (Array.isArray(steps)) {
            return steps.map(step => {
                if (typeof step === 'string') return step;
                if (step.text) return step.text;
                return String(step);
            }).filter(step => step && step.trim());
        }
        return [];
    }

    extractTips(steps) {
        if (!steps) return '';
        
        const tips = [];
        steps.forEach(step => {
            if (typeof step === 'object' && step.tip) {
                tips.push(step.tip);
            }
        });
        
        return tips.join(' ');
    }

    handleBackClick(e) {
        e.preventDefault();

        if (this.safeSameOriginReferrer() && history.length > 1) {
            history.back();
            return;
        }
        if (this.returnUrl) {
            location.href = this.returnUrl;
            return;
        }
        location.href = this.fallbackBySrc();
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new RecipeDetail();
});

export { RecipeDetail };