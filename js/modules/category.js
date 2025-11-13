(function () {
  const qs = new URLSearchParams(location.search);
  const tagParam = qs.get('tag') || '';
  const returnUrl = qs.get('return') || '';

  const grid = document.getElementById('cat-grid');
  const title = document.getElementById('cat-title');
  const sub = document.getElementById('cat-sub');
  const back = document.getElementById('back-link');

  const MAIN_TAGS = new Set([
    "Món mặn", "Món chay", "Bánh ngọt", "Tráng miệng", "Đồ uống", "Món nướng"
  ]);

  const DATA_URL = '../../js/data/recipe-details.data.json';

  function humanTag(t) { return t; }

  async function getJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed: ' + url + ' ' + res.status);
    return res.json();
  }

  function bucketOf(idNum) {
    if (idNum >= 101 && idNum <= 199) return "all";
    if (idNum >= 201 && idNum <= 299) return "trending";
    if (idNum >= 301 && idNum <= 399) return "saved";
    return "all";
  }

  function renderList(list) {
    if (!list.length) {
      grid.innerHTML = `<p>Chưa có công thức cho tag "${humanTag(tagParam)}".</p>`;
      return;
    }
    grid.innerHTML = list.map(r => `
      <div class="recipe-card" data-recipe-id="${r.id}" data-source="${bucketOf(Number(r.id))}">
        <div class="recipe-card__image">
          <img src="${r.img || r.hero}" alt="${r.name}">
        </div>
        <div class="recipe-card__content">
          <h3 class="recipe-card__title">${r.name}</h3>
          <p class="recipe-card__description">${r.short || ""}</p>
          <div class="recipe-card__meta">
            <span class="recipe-card__chef">${r.chef || ""}</span>
            <span class="recipe-card__time">${r.time || ""}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function setupBack() {
    back?.addEventListener('click', (e) => {
      e.preventDefault();
      if (returnUrl) { location.href = returnUrl; return; }
      location.href = "../../pages/explore.html#category";
    });
  }

  async function init() {
    const tag = String(tagParam).trim();
    title.textContent = tag ? `Danh mục: ${humanTag(tag)}` : "Danh mục";
    sub.textContent = tag ? `Các công thức mang tag "${humanTag(tag)}"` : "Chọn một danh mục để xem";

    if (!tag) {
      grid.innerHTML = `<p>Thiếu tham số tag.</p>`;
      setupBack(); return;
    }
    if (!MAIN_TAGS.has(tag)) {
      grid.innerHTML = `<p>Tag không hợp lệ. Vui lòng chọn từ 6 danh mục chính.</p>`;
      setupBack(); return;
    }

    try {
      const all = await getJson(DATA_URL);
      const list = (all || []).filter(it =>
        Array.isArray(it.tags) && it.tags.includes(tag)
      );
      renderList(list);
    } catch (e) {
      console.error(e);
      grid.innerHTML = `<p>Lỗi tải dữ liệu. Vui lòng thử lại.</p>`;
    }
    setupBack();
  }

  init();
})();