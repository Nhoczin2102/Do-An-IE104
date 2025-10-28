document.addEventListener('DOMContentLoaded',() => {
    let allRecipesData = []
    let currentDisplayCount = 6
    const recipesPerLoad = 6

    const chefsContainer = document.querySelector('.explore-chefs')
    const trendingContainer = document.querySelector('explore-trending')
    const allRecipesContainer = document.querySelector('explore-allrecipes')
    const loadMoreBtn = document.querySelector('load-more-btn')
    // 1. Nut xem them
    function updateLoadMoreButton() {
        if (currentDisplayCount >= allRecipesData.length) {
           loadMoreBtn.style.display = 'none'; 
        }
        else {
            loadMoreBtn.style.display = 'block';
        }
    }
    // 2. Danh sach tat ca cong thuc
    function renderAllRecipes() {
        //cat mang data
        const recipesToShow = allRecipesData.slice(0,currentDisplayCount)
        //html
        allRecipesContainer.innerHTML = recipesToShow.map(recipe => 
            `
                <div class='recipe-card' data-recipe-id='${recipe.id}'>
                    <div class='recipe-anh'>
                        <img src='${recipe.image}' alt='${recipe.name}'>
                    </div>
                    <div class='recipe-body'>
                        <h3 class='recipe-title'>${recipe.name}</h3>
                        <p class='recipe-text'>${recipe.ingredients}</p>
                        <div class='recipe-meta'>
                            <span class='chef'>${recipe.chef}</span>
                            <span class='time'>${recipe.time}</span>
                        </div>
                    </div>
                </div>
            `).join('')
        updateLoadMoreButton()
    }
    // 3. Xu ly nut xem them
    function handleLoadMore() {
        currentDisplayCount += recipesPerLoad //them sl cong thuc
        renderAllRecipes() //goi lai de load
    }
    // 4. Ham tai lai du lieu
    async function loadData() {
        try {
            //Tai dau bep
            const chefRes = await fetch('../data/chefs.explore.data.json')
            const chefs = await chefRes.json()
            chefsContainer.innerHTML = chefs.map(chef =>`
                <div class='chef-card' data-chef-id='${chef.id}'>
                    <div class="chef-avatar">${chef.avatar}</div>
                    <div class="chef-name">${chef.name}</div>
                    <div class="chef-specialty">${chef.specialty}</div>
                </div>
            `).join('')
            //Tai cong thuc thinh hanh
            const trendingRes = await fetch('../data/trending.explore.data.json')
            const trending = await trendingRes.json()
            trendingContainer.innerHTML = trending.map(recipe => `
                <div class='recipe-card' data-recipe-id='${recipe.id}'>
                    <div class='recipe-anh'>
                        <img src='${recipe.image}' alt='${recipe.name}'>
                    </div>
                    <div class='recipe-body'>
                        <h4 class='recipe-title'>${recipe.name}</h4>
                        <p class='recipe-text'>${recipe.ingredients}</p>
                        <div class='recipe-meta'>
                            <span class='chef'>${recipe.chef}</span>
                            <span class='time'>${recipe.time}</span>
                        </div>
                    </div>
                </div> 
            `).join('')

            //Tai tat ca cong thuc
            const allRecipeRes = await fetch('../data/allrecipes.explore.data.json')
            allRecipesData = await allRecipeRes.json()
            renderAllRecipes()
        } catch (error) {
            console.error("Không thể tải dữ liệu:", error);
            allRecipesContainer.innerHTML = "<p>Lỗi tải dữ liệu. Vui lòng thử lại.</p>";
        }
    }
    // su kien cho nut xem them
    loadMoreBtn.addEventListener('click',handleLoadMore)
    // su kien click vao the
    document.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe-card');
        if (recipeCard) {
            const recipeId = recipeCard.dataset.recipeId;
            console.log('Clicked recipe:', recipeId);
            // chuyen trang cong thuc
        }

        const chefCard = e.target.closest('.chef-card');
        if (chefCard) {
            const chefId = chefCard.dataset.chefId;
            console.log('Clicked chef:', chefId);
            // chuyen trang dau bep
        }
    });

    loadData()
})