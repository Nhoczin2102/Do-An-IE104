(function () {
    const TARGET = '../../pages/category.html';

    // Lắng nghe sự kiện click toàn trang
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.explore-category-card[data-tag]');
        if (!card) return;

        const tag = card.getAttribute('data-tag') || '';
        const from = location.pathname + location.search + location.hash;

        // Chuyển hướng đến trang danh mục với tham số
        location.href = `${TARGET}?tag=${encodeURIComponent(tag)}&return=${encodeURIComponent(from)}`;
    });
})();