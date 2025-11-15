document.addEventListener("DOMContentLoaded", async () => {
  const recipeContainer = document.querySelector(".saved-recipes__grid");
  const isSavedRecipe = (id) => id >= 301 && id <= 399;

  try {
    const response = await fetch('../js/data/recipe-details.data.json');
    // Kiem tra responsive
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allRecipes = await response.json();
    if (!Array.isArray(allRecipes)) {
      throw new Error('Invalid data format: expected array');
    }
    const savedRecipes = allRecipes.filter(recipe => 
      isSavedRecipe(Number(recipe.id))
    );

    if (savedRecipes.length === 0) {
      recipeContainer.innerHTML = `
        <div class="no-recipes-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          <p style="font-size: 18px; color: var(--muted);">Chưa có công thức nào được lưu.</p>
        </div>
      `;
      return;
    }
    recipeContainer.innerHTML = savedRecipes.map(recipe => `
      <article class="recipe-card" data-recipe-id="${recipe.id}" data-source="saved">
        <div class="recipe-card__image">
          <img src="${recipe.img}" alt="${recipe.name.replace(/"/g, '&quot;')}" loading="lazy" />
        </div>
        <div class="recipe-card__content">
          <h3 class="recipe-card__title">${recipe.name}</h3>
          <p class="recipe-card__description">${recipe.short || ''}</p>
        </div>
      </article>
    `).join('');

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu công thức:", error);
    recipeContainer.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <p style="font-size: 18px; color: var(--error-color, #dc3545);">
          Không thể tải danh sách công thức đã lưu. Vui lòng thử lại sau.
        </p>
      </div>
    `;
  }
});