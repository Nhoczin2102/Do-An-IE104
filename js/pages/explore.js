document.addEventListener('DOMContentLoaded', () => {
    const chefsContainer = document.querySelector('.explore-chefs__grid');
    const trendingContainer = document.querySelector('.explore-trending__scroll');
    const allRecipesContainer = document.querySelector('.explore-recipes__grid');
    const loadMoreBtn = document.querySelector('.explore-load-more__button');

    let allData = [];
    let allBucket = [];      // ID: 101-200
    let trendingBucket = []; // ID: 201-300
    let currentDisplayCount = 6;
    const recipesPerLoad = 6;

    // Phân loại dữ liệu theo ID
    function bucketByIdPrefix(list) {
        const isALL = (id) => id >= 101 && id <= 200;
        const isTREND = (id) => id >= 201 && id <= 300;
        return {
            all: list.filter(x => isALL(Number(x.id))),
            trending: list.filter(x => isTREND(Number(x.id))),
        };
    }

    // Render danh sách đầu bếp
    function renderChefs(chefs) {
        chefsContainer.innerHTML = (chefs || []).map(chef => `
            <div class='explore-chef-card' data-chef-id='${chef.id}'>
                <img src="${chef.img}" alt="${chef.name}" class="explore-chef-card__avatar" />
                <div class="explore-chef-card__name">${chef.name}</div>
                <div class="explore-chef-card__specialty">${chef.specialty}</div>
            </div>
        `).join('');
    }

    // Render mục Trending
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

    // Render tất cả công thức
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

        if (currentDisplayCount >= allBucket.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Tải dữ liệu chính
    async function loadData() {
        try {
            // Fetch Chefs
            try {
                const chefRes = await fetch('../../data/chefs.explore.data.json');
                const chefs = await chefRes.json();
                renderChefs(chefs);
            } catch {}

            // Fetch Recipes
            const res = await fetch('../../data/recipe-details.data.json');
            allData = await res.json();

            const buckets = bucketByIdPrefix(allData);
            allBucket = buckets.all;
            trendingBucket = buckets.trending;

            renderTrending();
            renderAllRecipes();
        } catch (e) {
            allRecipesContainer.innerHTML = "<p>Lỗi tải dữ liệu. Vui lòng thử lại.</p>";
        }
    }

    // Sự kiện nút xem thêm
    loadMoreBtn.addEventListener('click', () => {
        currentDisplayCount += recipesPerLoad;
        renderAllRecipes();
    });

    loadData();
});