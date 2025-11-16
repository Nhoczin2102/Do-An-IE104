(function () {
  const qs = new URLSearchParams(window.location.search);
  const id = Number(qs.get("id"));
  const srcParam = (qs.get("src") || "").toLowerCase(); 
  const returnUrl = qs.get("return");                    

  const $ = (s) => document.querySelector(s);
  const imgImg = $("#recipe-img");
  const nameH1 = $("#recipe-name");
  const nameH2 = $("#recipe-name-dup");
  const chefEl = $("#recipe-chef");
  const timeEl = $("#recipe-time");
  const tagsEl = $("#recipe-tags");
  const ingredientsEl = $("#ingredients");
  const stepsEl = $("#steps");
  const nutritionEl = $("#nutrition");
  const backBtn = $("#back-link");

  if (!id) {
    nameH1 && (nameH1.textContent = "Thiếu tham số id");
    return;
  }

  const bucketOf = (idNum) => {
    if (idNum >= 101 && idNum <= 199) return "all";
    if (idNum >= 201 && idNum <= 299) return "trending";
    if (idNum >= 301 && idNum <= 399) return "saved";
    if (idNum >= 401) return "profile1"; // THÊM DÒNG NÀY
    return "unknown";
  };

  const label = (x) =>
    x==="trending" ? "Thịnh hành" :
    x==="saved"    ? "Đã lưu" :
    x==="all"      ? "Tất cả" :
    x==="profile1" ? "Hồ sơ" : x; 

  function safeSameOriginReferrer() {
    try {
      return document.referrer && new URL(document.referrer).origin === location.origin;
    } catch { return false; }
  }

  function fallbackBySrc() {
    const src = ["trending","saved","all","profile1"].includes(srcParam) ? srcParam : bucketOf(id); // THÊM "profile1" VÀO MẢNG
    if (src === "saved")    return "../../pages/myRecipe.html";
    if (src === "trending") return "../../pages/explore.html#trending";
    if (src === "all")      return "../../pages/explore.html#all";
    if (src === "profile1") return "../../pages/profile1.html"; 
    return "../explore.html";
  }

  async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch fail: " + url);
    return res.json();
  }

  async function load() {
    const details = await getJson("../../js/data/recipe-details.data.json");
    const d = Array.isArray(details) ? details.find(x => Number(x.id) === id) : null;
    if (!d) throw new Error("Không tìm thấy công thức id=" + id);

    render(d);

    const main = ["trending","saved","all","profile1"].includes(srcParam) ? srcParam : bucketOf(id); // THÊM "profile1" VÀO MẢNG
    const badges = [];
    if (badges.length) {
      tagsEl && tagsEl.insertAdjacentHTML("afterbegin", badges.join(" "));
    }
  }

  function render(d) {
    const name = d.name || "Công thức";
    if (nameH1) nameH1.textContent = name;
    if (nameH2) nameH2.textContent = name;

    if (imgImg) {
      imgImg.src = d.img || "../../images/placeholder/recipe.png";
      imgImg.alt = name;
    }

    if (chefEl) chefEl.textContent = d.chef ? `Đầu bếp: ${d.chef}` : "";
    if (timeEl) timeEl.textContent = d.time ? `• ${d.time}` : "";

    if (tagsEl) {
      tagsEl.insertAdjacentHTML(
        "beforeend",
        (d.tags || []).map(t => `<span class="recipe-detail__tag">${t}</span>`).join("")
      );
    }

    if (ingredientsEl) {
      const ing = d.ingredients || [];
      const ingHtml = Array.isArray(ing) && typeof ing[0] === "string"
        ? `<ul>${ing.map(i=>`<li>${i}</li>`).join("")}</ul>`
        : (Array.isArray(ing)
            ? ing.map(g => `
                <div class="recipe-detail__ingredient-group">
                  ${g.title ? `<h4>${g.title}</h4>` : ""}
                  <ul>${(g.items||[]).map(i=>`<li>${i}</li>`).join("")}</ul>
                </div>`).join("")
            : "");
      ingredientsEl.innerHTML = ingHtml || `<li>Đang cập nhật...</li>`;
    }

    if (stepsEl) {
      stepsEl.innerHTML = (d.steps || []).length
        ? d.steps.map(s => {
            const text = (typeof s === "string") ? s : s.text;
            const tip  = (typeof s === "object" && s.tip) ? `<div class="recipe-detail__step-tip">Mẹo: ${s.tip}</div>` : "";
            return `<li><div class="recipe-detail__step-line">${text}</div>${tip}</li>`;
          }).join("")
        : `<li>Đang cập nhật...</li>`;
    }

    if (nutritionEl) {
      const n = d.nutrition || {};
      const nutritionItems = Object.keys(n).map(k => `<li><strong>${k}:</strong> ${n[k]}</li>`).join("");
      nutritionEl.innerHTML = nutritionItems || `<li>Đang cập nhật...</li>`;
    }
  }

  backBtn && backBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //  Có lịch sử cùng origin → quay lại
    if (safeSameOriginReferrer() && history.length > 1) {
      history.back();
      return;
    }
    if (returnUrl) {
      location.href = returnUrl;
      return;
    }
    location.href = fallbackBySrc();
  });

  load().catch((err) => {
    console.error(err);
    if (nameH1) nameH1.textContent = "Không thể tải chi tiết công thức.";
  });
})();