// feed-demo.js
document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const posts = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/100?img=32",
      name: "Chí Thành",
      time: "2 giờ trước",
      content: "Hôm nay mình sẽ chia sẻ công thức nấu ăn món bánh ngọt này nhé, chúc mọi người thành công thực hiện.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
      likes: 45,
      comments: 12,
      shares: 5,
      isLiked: false,
      recipe: {
        title: "Bánh Ngọt Pháp",
        prepTime: "30 phút",
        cookTime: "25 phút",
        servings: "4 người",
        difficulty: "Trung bình",
        ingredients: [
          "200g bột mì",
          "150g đường",
          "3 quả trứng",
          "100g bơ",
          "200ml sữa tươi",
          "1 thìa cà phê vani",
          "1 thìa cà phê bột nở"
        ],
        steps: [
          "Làm nóng lò nướng ở 180°C",
          "Trộn bột mì, đường và bột nở",
          "Đánh tan trứng với sữa và vani",
          "Trộn đều hỗn hợp ướt và khô",
          "Cho bơ đun chảy vào trộn đều",
          "Đổ hỗn hợp vào khuôn",
          "Nướng trong 25 phút"
        ],
        tips: "Có thể thêm chocolate chips hoặc trái cây khô để tăng hương vị"
      },
      commentsList: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/100?img=15",
          name: "Minh Anh",
          time: "1 giờ trước",
          content: "Nhìn ngon quá! Có thể chia sẻ chi tiết nguyên liệu không bạn?"
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/100?img=22",
          name: "Tuấn Vũ",
          time: "45 phút trước",
          content: "Mình đã thử làm theo và thành công, cảm ơn bạn!"
        }
      ]
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/100?img=12",
      name: "Minh Anh",
      time: "4 giờ trước",
      content: "Công thức phở bò Hà Nội truyền thống - ai muốn học thì comment nhé!",
      image: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop",
      likes: 89,
      comments: 23,
      shares: 8,
      isLiked: true,
      recipe: {
        title: "Phở Bò Hà Nội",
        prepTime: "45 phút",
        cookTime: "3 giờ",
        servings: "6 người",
        difficulty: "Khó",
        ingredients: [
          "1kg xương ống bò",
          "500g thịt bò",
          "200g bánh phở",
          "Hành tây, gừng",
          "Gia vị: quế, hồi, thảo quả",
          "Rau thơm: húng, ngò gai",
          "Chanh, ớt, hành phi"
        ],
        steps: [
          "Chần xương bò qua nước sôi",
          "Ninh xương với gia vị trong 3 giờ",
          "Thái thịt bò mỏng",
          "Chần bánh phở qua nước sôi",
          "Xếp bánh phở vào tô, thêm thịt",
          "Chan nước dùng nóng",
          "Trang trí với rau thơm và hành phi"
        ],
        tips: "Nước dùng phải trong và ngọt tự nhiên từ xương"
      },
      commentsList: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/100?img=8",
          name: "Hương Giang",
          time: "3 giờ trước",
          content: "Nước dùng phải ninh trong bao lâu vậy bạn?"
        }
      ]
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/100?img=45",
      name: "Hương Giang",
      time: "1 ngày trước",
      content: "Chia sẻ cách làm bánh flan caramel mềm mịn, không bị rỗng.",
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop",
      likes: 67,
      comments: 15,
      shares: 3,
      isLiked: false,
      recipe: {
        title: "Bánh Flan Caramel",
        prepTime: "20 phút",
        cookTime: "40 phút",
        servings: "6 người",
        difficulty: "Dễ",
        ingredients: [
          "4 quả trứng gà",
          "200ml sữa tươi",
          "200ml sữa đặc",
          "100g đường caramel",
          "1 ống vani"
        ],
        steps: [
          "Làm caramel: đun đường với ít nước đến khi vàng",
          "Rót caramel vào khuôn",
          "Đánh tan trứng với sữa",
          "Lọc hỗn hợp qua rây",
          "Rót vào khuôn caramel",
          "Hấp cách thủy 40 phút",
          "Để nguội và cho vào tủ lạnh"
        ],
        tips: "Dùng nước ấm khi hấp để bánh không bị rỗng"
      },
      commentsList: []
    }
  ];

  function renderComment(comment) {
    return `
      <div class="feed-comment">
        <img class="feed-comment-avatar" src="${comment.avatar}" alt="${comment.name}">
        <div class="feed-comment-content">
          <div class="feed-comment-header">
            <strong class="feed-comment-name">${comment.name}</strong>
            <span class="feed-comment-time">${comment.time}</span>
          </div>
          <p class="feed-comment-text">${comment.content}</p>
        </div>
      </div>
    `;
  }

  function renderRecipe(recipe) {
    if (!recipe) return '';
    
    return `
      <div class="recipe-section" style="background:#f8f9fa;border-radius:12px;padding:16px;margin:12px 0">
        <h4 style="margin:0 0 12px 0;color:#FF6967">🍴 ${recipe.title}</h4>
        
        <div class="recipe-info" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));gap:8px;margin-bottom:12px;font-size:12px;color:#666">
          <div>⏱️ Chuẩn bị: ${recipe.prepTime}</div>
          <div>🔥 Nấu: ${recipe.cookTime}</div>
          <div>👥 Khẩu phần: ${recipe.servings}</div>
          <div>📊 Độ khó: ${recipe.difficulty}</div>
        </div>
        
        <div class="recipe-details" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="ingredients">
            <h5 style="margin:0 0 8px 0;color:#333">Nguyên liệu:</h5>
            <ul style="margin:0;padding-left:16px;font-size:13px;color:#555">
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
          
          <div class="steps">
            <h5 style="margin:0 0 8px 0;color:#333">Các bước:</h5>
            <ol style="margin:0;padding-left:16px;font-size:13px;color:#555">
              ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
        
        ${recipe.tips ? `
          <div class="recipe-tips" style="margin-top:12px;padding:8px;background:#fff;border-radius:8px;border-left:3px solid #FF6967">
            <strong>💡 Mẹo:</strong> <span style="font-size:13px">${recipe.tips}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderPost(post) {
    return `
      <article class="feed-post" data-post-id="${post.id}">
        <!-- Post Header -->
        <div class="feed-post-header">
          <img class="feed-post-avatar" src="${post.avatar}" alt="${post.name}">
          <div class="feed-post-user">
            <strong class="feed-post-name">${post.name}</strong>
            <div class="feed-post-time">${post.time}</div>
          </div>
        </div>

        <!-- Post Content -->
        <p class="feed-post-content">${post.content}</p>
        
        <!-- Recipe Section -->
        ${post.recipe ? renderRecipe(post.recipe) : ''}
        
        <!-- Post Image -->
        <img class="feed-post-image" src="${post.image}" alt="post image">

        <!-- Post Stats -->
        <div class="feed-post-stats">
          <span class="feed-post-likes">${post.likes} lượt thích</span>
          <span class="feed-post-comments-count">${post.comments} bình luận</span>
          <span class="feed-post-shares">${post.shares} chia sẻ</span>
        </div>

        <!-- Post Actions -->
        <div class="feed-post-actions">
          <button class="feed-action-btn ${post.isLiked ? 'active' : ''}" data-action="like">
            <i class="fas fa-heart"></i>
            <span>${post.isLiked ? 'Đã thích' : 'Thích'}</span>
          </button>
          <button class="feed-action-btn" data-action="comment">
            <i class="fas fa-comment"></i>
            <span>Bình luận</span>
          </button>
          <button class="feed-action-btn" data-action="share">
            <i class="fas fa-share"></i>
            <span>Chia sẻ</span>
          </button>
        </div>

        <!-- Comments Section -->
        <div class="feed-comments">
          ${post.commentsList.map(comment => renderComment(comment)).join('')}
          
          <!-- Comment Input -->
          <div class="feed-comment-input">
            <img class="feed-comment-avatar" src="../../assets/home-page/image 1.png" alt="Your avatar">
            <div class="comment-input-wrapper">
              <input type="text" placeholder="Viết bình luận..." class="comment-input">
              <button class="comment-submit">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  feed.innerHTML = posts.map(post => renderPost(post)).join('');

  // Event listeners
  feed.addEventListener('click', (e) => {
    if (e.target.closest('.feed-action-btn')) {
      const button = e.target.closest('.feed-action-btn');
      const action = button.dataset.action;
      
      if (action === 'like') {
        button.classList.toggle('active');
        const text = button.querySelector('span');
        text.textContent = button.classList.contains('active') ? 'Đã thích' : 'Thích';
      } else if (action === 'comment') {
        const commentInput = button.closest('.feed-post').querySelector('.comment-input');
        commentInput.focus();
      }
    }
  });
  
});

