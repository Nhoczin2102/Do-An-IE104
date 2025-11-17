export class RecipeNavigation {
    constructor() {
        this.init();
    }

    // Khởi tạo
    init() {
        this.addRecipeClickHandlers();
    }

    // Gắn sự kiện click cho danh sách món ăn
    addRecipeClickHandlers() {
        const recipeItems = document.querySelectorAll('.sidebar-right__chef[data-recipe-id]');
        
        recipeItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToRecipeDetail(item);
            });
        });
    }

    // Chuyển hướng đến trang chi tiết
    navigateToRecipeDetail(recipeElement) {
        const recipeId = recipeElement.getAttribute('data-recipe-id');
        const recipeName = recipeElement.getAttribute('data-recipe-name');
        const recipeChef = recipeElement.getAttribute('data-recipe-chef');

        if (!recipeId) {
            console.error('Không tìm thấy ID công thức');
            return;
        }

        const params = new URLSearchParams({
            id: recipeId,
            src: 'sidebar',
            return: window.location.href
        });

        const recipeDetailUrl = `./pages/recipe-detail.html?${params.toString()}`;
        
        window.location.href = recipeDetailUrl;
    }

    // Thêm món ăn mới vào sidebar
    addRecipeToSidebar(recipeData) {
        const sidebar = document.querySelector('.sidebar-right__card');
        if (!sidebar) return;

        const recipeHtml = `
            <div class="sidebar-right__chef" 
                 data-recipe-id="${recipeData.id}"
                 data-recipe-name="${recipeData.name}"
                 data-recipe-chef="${recipeData.chef}">
                <img src="${recipeData.image}" alt="${recipeData.name}" class="sidebar-right__chef-avatar" />
                <div class="sidebar-right__chef-info">
                    <strong class="sidebar-right__chef-name">${recipeData.name}</strong><br />
                    <small class="sidebar-right__chef-specialty">${recipeData.chef}</small>
                </div>
            </div>
        `;

        // Chèn sau tiêu đề
        const title = sidebar.querySelector('.sidebar-right__title');
        if (title) {
            title.insertAdjacentHTML('afterend', recipeHtml);
        }

        // Gắn sự kiện cho món mới thêm
        const newRecipe = sidebar.querySelector(`[data-recipe-id="${recipeData.id}"]`);
        if (newRecipe) {
            newRecipe.style.cursor = 'pointer';
            newRecipe.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToRecipeDetail(newRecipe);
            });
        }
    }
}