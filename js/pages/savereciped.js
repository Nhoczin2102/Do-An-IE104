document.addEventListener("DOMContentLoaded", async () => {
  const recipeContainer = document.querySelector(".saved-recipes__grid");

  const isSAVED = (id) => id >= 301 && id <= 399;

  try {
    const response = await fetch('../../data/recipe-details.data.json');
    const all = await response.json();

    const saved = all.filter(r => isSAVED(Number(r.id)));

    recipeContainer.innerHTML = saved.map(r => `
      <article class="recipe-card" data-recipe-id="${r.id}" data-source="saved">
        <div class="recipe-card__image">
          <img src="${r.img}" alt="${r.name}" />
        </div>
        <div class="recipe-card__content">
          <h3 class="recipe-card__title">${r.name}</h3>
          <p class="recipe-card__description">${r.short || ''}</p>
        </div>
      </article>
    `).join('');

  } catch (error) {
    console.error("Lỗi khi tải file:", error);
    recipeContainer.innerHTML = "<p>Không thể tải danh sách công thức.</p>";
  }
});