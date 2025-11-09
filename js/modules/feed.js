// Import "Dữ liệu"
import { posts } from '../data/posts.js';

// "Máy in" sẽ được đưa vào từ file home.js
let renderer; 
const feed = document.getElementById("feed");

/**
 * 1. HÀM RENDER FEED
 * (Tối ưu: Hàm này giờ nhận 1 mảng để render, giúp cho việc tìm kiếm)
 */
export function renderFeed(postsToRender) {
  if (!feed) return;
  console.log('🔄 Rendering feed with', postsToRender.length, 'posts');
  
  feed.innerHTML = postsToRender.map(post => renderer.renderPost(post)).join('');
  console.log('✅ Feed rendered successfully');
}

/**
 * 2. HÀM XỬ LÝ TƯƠNG TÁC (Like, Comment)
 */
function initFeedInteractions() {
  if (!feed) return;

  feed.addEventListener('click', (e) => {
    // Xử lý Like, Comment, Share
    const button = e.target.closest('.feed-action-btn');
    if (button) {
      const action = button.dataset.action;
      const postId = parseInt(button.dataset.postId);
      const post = posts.find(p => p.id === postId); // Tìm trong mảng posts gốc
      
      if (!post) return;
      
      if (action === 'like') {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        renderFeed(posts); // Render lại TOÀN BỘ feed
      } else if (action === 'comment') {
        const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        if (commentInput) commentInput.focus();
      } else if (action === 'share') {
        post.shares += 1;
        renderFeed(posts); // Render lại TOÀN BỘ feed
        alert('Đã chia sẻ bài viết!');
      }
    }

    // Xử lý gửi bình luận
    const commentSubmit = e.target.closest('.comment-submit');
    if (commentSubmit) {
      const postId = parseInt(commentSubmit.dataset.postId);
      const post = posts.find(p => p.id === postId);
      const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
      
      if (post && commentInput && commentInput.value.trim()) {
        const newComment = {
          id: Date.now(),
          avatar: "../../assets/home-page/image 1.png",
          name: "Minh Nhựt",
          time: "Vừa xong",
          content: commentInput.value.trim()
        };
        
        post.commentsList.push(newComment);
        post.comments += 1;
        commentInput.value = '';
        renderFeed(posts); // Render lại TOÀN BỘ feed
      }
    }
  });
}

/**
 * 3. HÀM XỬ LÝ TÌM KIẾM
 */
function initSearch() {
  const searchInput = document.querySelector('.header-search_bar input');
  const searchBtn = document.querySelector('.header-search_btn');

  if (!searchBtn || !searchInput) return;

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Nếu không tìm gì, render TẤT CẢ
    if (!searchTerm) {
      renderFeed(posts);
      return;
    }

    // Lọc vào một mảng MỚI, không làm hỏng mảng `posts` gốc
    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm) ||
      (post.recipe && post.recipe.title.toLowerCase().includes(searchTerm)) ||
      (post.recipe && post.recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      ))
    );

    // Chỉ render mảng đã lọc
    renderFeed(filteredPosts);
    console.log('🔍 Search results:', filteredPosts.length, 'posts found');
  }

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

/**
 * HÀM "MỤC LỤC" CỦA FILE NÀY
 * (File home.js sẽ gọi hàm này)
 */
export function initFeed(rendererInstance) {
  if (!feed) {
    console.error('❌ Không tìm thấy feed element');
    return;
  }
  
  // 1. Nhận "máy in" từ file home.js
  renderer = rendererInstance;

  // 2. Cung cấp hàm renderPost global (cho file createPost.js dùng)
  window.renderPost = (post) => renderer.renderPost(post);
  
  // 3. Chạy các chức năng
  renderFeed(posts); // Render lần đầu tiên
  initFeedInteractions();
  initSearch();
}