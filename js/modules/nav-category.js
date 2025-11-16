(function () {
  const TARGET = '../../pages/category.html';

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.explore-category-card[data-tag]');
    if (!card) return;

    const tag = card.getAttribute('data-tag') || '';
    const from = location.pathname + location.search + location.hash;
    // Điều hướng kèm return 
    location.href = `${TARGET}?tag=${encodeURIComponent(tag)}&return=${encodeURIComponent(from)}`;
  });
})();