// settings.js

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.settings-nav__item');
  const sections = document.querySelectorAll('.settings-section');
  const search = document.getElementById('search-settings');

  const showSection = (key) => {
    sections.forEach(s => s.classList.toggle('active', s.id === `${key}-section`));
    navItems.forEach(i => i.classList.toggle('active', i.dataset.section === key));
  };

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const key = item.dataset.section;
      if (key) showSection(key);
    });
  });

  // Lọc nhanh theo text (ẩn/hiện setting-item trong section đang mở)
  search?.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    const current = document.querySelector('.settings-section.active');
    if (!current) return;
    current.querySelectorAll('.setting-item').forEach(it => {
      const t = it.innerText.toLowerCase();
      it.style.display = t.includes(q) ? '' : 'none';
    });
  });

  // Mặc định
  showSection('account');
});