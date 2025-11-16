export class RecipeNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.addRecipeClickHandlers();
        console.log('🍽️ Recipe Navigation initialized');
    }

    addRecipeClickHandlers() {
        // Lấy tất cả các món ăn trong sidebar
        const recipeItems = document.querySelectorAll('.sidebar-right__chef[data-recipe-id]');
        
        recipeItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToRecipeDetail(item);
            });
        });
    }

    navigateToRecipeDetail(recipeElement) {
        const recipeId = recipeElement.getAttribute('data-recipe-id');
        const recipeName = recipeElement.getAttribute('data-recipe-name');
        const recipeChef = recipeElement.getAttribute('data-recipe-chef');

        if (!recipeId) {
            console.error('Recipe ID not found');
            return;
        }

        // Tạo URL với parameters
        const params = new URLSearchParams({
            id: recipeId,
            src: 'sidebar',
            return: window.location.href
        });

        const recipeDetailUrl = `./pages/recipe-detail.html?${params.toString()}`;
        
        console.log(`Navigating to recipe: ${recipeName} (ID: ${recipeId})`);
        window.location.href = recipeDetailUrl;
    }

    // Method để thêm món ăn mới vào sidebar
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

        // Thêm vào sau title
        const title = sidebar.querySelector('.sidebar-right__title');
        if (title) {
            title.insertAdjacentHTML('afterend', recipeHtml);
        }

        // Thêm event listener cho món ăn mới
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