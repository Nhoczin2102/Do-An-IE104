(function () {
    const DETAIL_PATH = '../../pages/recipe-detail.html';

    // Xử lý sự kiện click vào thẻ công thức
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.recipe-card');
        if (!card) return;

        const id = card.dataset.recipeId || card.getAttribute('data-recipe-id');
        if (!id) return;

        const src = (card.dataset.source || 'all').toLowerCase();

        // Lưu URL hiện tại để quay lại sau
        const from = location.pathname + location.search + location.hash;
        const returnParam = encodeURIComponent(from);

        // Chuyển hướng đến trang chi tiết
        window.location.href = `${DETAIL_PATH}?id=${encodeURIComponent(id)}&src=${encodeURIComponent(src)}&return=${returnParam}`;
    });
})();