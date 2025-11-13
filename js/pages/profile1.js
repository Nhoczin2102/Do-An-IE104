import { samplePosts } from '../data/userPostData.js';

// Function to render posts
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
  
  // Add click event to post cards
  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', function() {
      const postId = this.getAttribute('data-id');
      // In a real app, this would navigate to the post detail page
      alert(`Xem chi tiết bài viết ID: ${postId}`);
    });
  });
}

// Function to sort posts
function sortPosts(posts, sortBy) {
  const sortedPosts = [...posts];
  
  switch(sortBy) {
    case 'newest':
      return sortedPosts.sort((a, b) => {
        // In a real app, you would compare actual dates
        return a.id - b.id;
      });
    case 'oldest':
      return sortedPosts.sort((a, b) => {
        return b.id - a.id;
      });
    case 'popular':
      return sortedPosts.sort((a, b) => {
        return b.likes - a.likes;
      });
    default:
      return sortedPosts;
  }
}

// Function to filter posts
function filterPosts(posts, filter) {
  switch(filter) {
    case 'popular':
      return posts.filter(post => post.likes > 200);
    case 'recent':
      // In a real app, you would filter by actual date
      return posts.filter(post => post.id >= 4);
    default:
      return posts;
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Render initial posts
  renderPosts(samplePosts);
  
  // Filter tabs event listeners
  document.querySelectorAll('.filter-tabs__tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active tab
      document.querySelectorAll('.filter-tabs__tab').forEach(t => t.classList.remove('filter-tabs__tab--active'));
      this.classList.add('filter-tabs__tab--active');
      
      // Get filter value
      const filter = this.getAttribute('data-filter');
      
      // Filter and render posts
      const filteredPosts = filterPosts(samplePosts, filter);
      const sortBy = document.getElementById('sortSelect').value;
      const sortedPosts = sortPosts(filteredPosts, sortBy);
      renderPosts(sortedPosts);
    });
  });
  
  // Sort select event listener
  document.getElementById('sortSelect').addEventListener('change', function() {
    const sortBy = this.value;
    const activeFilter = document.querySelector('.filter-tabs__tab--active').getAttribute('data-filter');
    
    const filteredPosts = filterPosts(samplePosts, activeFilter);
    const sortedPosts = sortPosts(filteredPosts, sortBy);
    renderPosts(sortedPosts);
  });
  
  // Create post button event listener
  document.querySelector('.btn--create-post').addEventListener('click', function() {
    // In a real app, this would navigate to the create post page
    alert('Chuyển đến trang tạo bài viết mới');
  });
});