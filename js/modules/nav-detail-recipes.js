(function () {
  const DETAIL_PATH = '../../components/modules/recipe-detail.html';
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.recipe-card');
    if (!card) return;
    const id = card.dataset.recipeId || card.getAttribute('data-recipe-id');
    if (!id) return;
    const src = (card.dataset.source || 'all').toLowerCase();
    // Lưu lại nơi xuất phát 
    const from = location.pathname + location.search + location.hash; 
    const returnParam = encodeURIComponent(from);
    // Quay ve
    window.location.href =
      `${DETAIL_PATH}?id=${encodeURIComponent(id)}&src=${encodeURIComponent(src)}&return=${returnParam}`;
  });
})();
