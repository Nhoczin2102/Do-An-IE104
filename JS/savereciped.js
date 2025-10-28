document.addEventListener("DOMContentLoaded", async () => {
    const recipeContainer = document.querySelector(".save-baiviet");
    try {
        const response = await fetch('../data/savereciped.data.json');
        const recipes = await response.json();
        recipeContainer.innerHTML = ""; 
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("article");
            recipeCard.className = "recipe-card";
            
            recipeCard.innerHTML = `
                <div class="recipe-anh">
                    <img src="${recipe.img}" alt="${recipe.alt}" />
                </div>
                <div class="recipe-body">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-text">${recipe.desc}</p>
                </div>
            `;
            
            recipeContainer.appendChild(recipeCard);
        });

    } catch (error) {
        console.error("Lỗi khi tải file:", error);
        recipeContainer.innerHTML = "<p>Không thể tải danh sách công thức.</p>";
    }
});