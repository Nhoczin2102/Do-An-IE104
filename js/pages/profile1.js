// Lấy dữ liệu bài viết
async function fetchPosts() {
    try {
        const response = await fetch('../../data/userpostdata.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Render danh sách bài viết
function renderPosts(posts) {
    const postsGrid = document.getElementById('postsGrid');
    
    if (posts.length === 0) {
        document.getElementById('emptyPosts').style.display = 'block';
        postsGrid.innerHTML = '';
        return;
    }
    
    document.getElementById('emptyPosts').style.display = 'none';
    
    postsGrid.innerHTML = posts.map(post => `
        <div class="post-card" data-id="${post.id}">
            <img src="${post.image}" alt="${post.title}" class="post-card__image">
            <div class="post-card__content">
                <h3 class="post-card__title">${post.title}</h3>
                <p class="post-card__excerpt">${post.excerpt}</p>
                <div class="post-card__meta">
                    <div class="post-card__stats">
                        <div class="post-card__stat">
                            <i class="fas fa-heart"></i>
                            <span>${post.likes}</span>
                        </div>
                        <div class="post-card__stat">
                            <i class="fas fa-comment"></i>
                            <span>${post.comments}</span>
                        </div>
                        <div class="post-card__stat">
                            <i class="fas fa-bookmark"></i>
                            <span>${post.saves}</span>
                        </div>
                    </div>
                    <div class="post-card__date">${post.date}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            window.location.href = `../pages/recipe-detail.html?id=${postId}&src=profile1`;
        });
    });
}

// Sắp xếp bài viết
function sortPosts(posts, sortBy) {
    const sortedPosts = [...posts];
    
    switch(sortBy) {
        case 'newest':
            return sortedPosts.sort((a, b) => a.id - b.id);
        case 'oldest':
            return sortedPosts.sort((a, b) => b.id - a.id);
        case 'popular':
            return sortedPosts.sort((a, b) => b.likes - a.likes);
        default:
            return sortedPosts;
    }
}

// Lọc bài viết
function filterPosts(posts, filter) {
    switch(filter) {
        case 'popular':
            return posts.filter(post => post.likes > 200);
        case 'recent':
            return posts.filter(post => post.id >= 4);
        default:
            return posts;
    }
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', async function() {
    let allPosts = [];
    
    try {
        allPosts = await fetchPosts();
        
        renderPosts(allPosts);
        setupEventListeners(allPosts);
        
    } catch (error) {
        console.error('Failed to initialize posts:', error);
        document.getElementById('emptyPosts').style.display = 'block';
        document.getElementById('emptyPosts').textContent = 'Không thể tải dữ liệu bài viết. Vui lòng thử lại sau.';
    }
});

// Thiết lập sự kiện
function setupEventListeners(posts) {
    // Sự kiện chuyển tab lọc
    document.querySelectorAll('.filter-tabs__tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tabs__tab').forEach(t => t.classList.remove('filter-tabs__tab--active'));
            this.classList.add('filter-tabs__tab--active');
            
            const filter = this.getAttribute('data-filter');
            const filteredPosts = filterPosts(posts, filter);
            
            const sortBy = document.getElementById('sortSelect').value;
            const sortedPosts = sortPosts(filteredPosts, sortBy);
            
            renderPosts(sortedPosts);
        });
    });
    
    // Sự kiện thay đổi sắp xếp
    document.getElementById('sortSelect').addEventListener('change', function() {
        const sortBy = this.value;
        const activeFilter = document.querySelector('.filter-tabs__tab--active').getAttribute('data-filter');
        
        const filteredPosts = filterPosts(posts, activeFilter);
        const sortedPosts = sortPosts(filteredPosts, sortBy);
        
        renderPosts(sortedPosts);
    });
    
    // Sự kiện nút tạo bài viết
    document.querySelector('.btn--create-post').addEventListener('click', function() {
        alert('Chuyển đến trang tạo bài viết mới');
    });
}