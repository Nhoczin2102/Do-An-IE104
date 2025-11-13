document.addEventListener('DOMContentLoaded', () => {
  // Cập nhật selectors theo BEM
  const chefsContainer = document.querySelector('.explore-chefs__grid');
  const trendingContainer = document.querySelector('.explore-trending__scroll');
  const allRecipesContainer = document.querySelector('.explore-recipes__grid');
  const loadMoreBtn = document.querySelector('.explore-load-more__button');

  let allData = [];            // toàn bộ entries 
  let allBucket = [];          // 101..199
  let trendingBucket = [];     // 201..299
  let currentDisplayCount = 6;
  const recipesPerLoad = 6;

  function bucketByIdPrefix(list) {
    const isALL = (id) => id >= 101 && id <= 200;
    const isTREND = (id) => id >= 201 && id <= 300;
    return {
      all: list.filter(x => isALL(Number(x.id))),
      trending: list.filter(x => isTREND(Number(x.id))),
    };
  }

  function renderChefs(chefs) {
    chefsContainer.innerHTML = (chefs || []).map(chef => `
      <div class='explore-chef-card' data-chef-id='${chef.id}'>
        <img src="${chef.img}" alt="${chef.name}" class="explore-chef-card__avatar" />
        <div class="explore-chef-card__name">${chef.name}</div>
        <div class="explore-chef-card__specialty">${chef.specialty}</div>
      </div>
    `).join('');
  }

  function renderTrending() {
    trendingContainer.innerHTML = trendingBucket.map(r => `
      <div class='recipe-card' data-recipe-id='${r.id}' data-source='trending'>
        <div class='recipe-card__image'>
          <img src='${r.img}' alt='${r.name}'>
        </div>
        <div class='recipe-card__content'>
          <h4 class='recipe-card__title'>${r.name}</h4>
          <p class='recipe-card__description'>${r.short || ''}</p>
          <div class='recipe-card__meta'>
            <span class='recipe-card__chef'>${r.chef || ''}</span>
            <span class='recipe-card__time'>${r.time || ''}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderAllRecipes() {
    const data = allBucket.slice(0, currentDisplayCount);
    allRecipesContainer.innerHTML = data.map(r => `
      <div class='recipe-card' data-recipe-id='${r.id}' data-source='all'>
        <div class='recipe-card__image'>
          <img src='${r.img}' alt='${r.name}'>
        </div>
        <div class='recipe-card__content'>
          <h3 class='recipe-card__title'>${r.name}</h3>
          <p class='recipe-card__description'>${r.short || ''}</p>
          <div class='recipe-card__meta'>
            <span class='recipe-card__chef'>${r.chef || ''}</span>
            <span class='recipe-card__time'>${r.time || ''}</span>
          </div>
        </div>
      </div>
    `).join('');

    // nút Load more
    if (currentDisplayCount >= allBucket.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  async function loadData() {
    try {
      // Chefs 
      try {
        const chefRes = await fetch('../js/data/chefs.explore.data.json');
        const chefs = await chefRes.json();
        renderChefs(chefs);
      } catch {  }

      // Đọc 1 file duy nhất
      const res = await fetch('../js/data/recipe-details.data.json');
      allData = await res.json();

      const buckets = bucketByIdPrefix(allData);
      allBucket = buckets.all;
      trendingBucket = buckets.trending;

      renderTrending();
      renderAllRecipes();
    } catch (e) {
      console.error('Không thể tải dữ liệu:', e);
      allRecipesContainer.innerHTML = "<p>Lỗi tải dữ liệu. Vui lòng thử lại.</p>";
    }
  }

  loadMoreBtn.addEventListener('click', () => {
    currentDisplayCount += recipesPerLoad;
    renderAllRecipes();
  });

  loadData();
});