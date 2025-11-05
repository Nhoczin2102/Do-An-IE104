// feed-demo.js - Complete and optimized version
document.addEventListener("DOMContentLoaded", function() {
  console.log('Feed demo loaded');

  // ========== GLOBAL VARIABLES ==========
  const feed = document.getElementById("feed");
  const feedCard = document.querySelector('.feed-card');
  const modal = document.getElementById('createPostModal');
  
  if (!feed) {
    console.error('❌ Không tìm thấy feed element');
    return;
  }

  // ========== DATA MANAGEMENT ==========
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
      time: "5 giờ trước",
      content: "Cá kho tộ là món ăn dân dã nhưng rất đậm đà hương vị Việt Nam. Cùng thử nhé!",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop",
      likes: 89,
      comments: 23,
      shares: 8,
      isLiked: true,
      recipe: {
        title: "Cá Kho Tộ",
        prepTime: "15 phút",
        cookTime: "45 phút",
        servings: "3-4 người",
        difficulty: "Dễ",
        ingredients: [
          "500g cá lóc",
          "3 thìa nước màu",
          "2 thìa nước mắm",
          "1 thìa đường",
          "1 củ hành tím",
          "2 trái ớt",
          "1 ít tiêu xay"
        ],
        steps: [
          "Cá làm sạch, cắt khúc vừa ăn",
          "Ướp cá với nước màu, nước mắm, đường, hành tím trong 15 phút",
          "Cho cá vào nồi đất, thêm nước xâm xấp mặt cá",
          "Kho với lửa nhỏ trong 45 phút",
          "Thêm ớt và tiêu trước khi tắt bếp"
        ],
        tips: "Nên dùng nồi đất để cá thấm gia vị và có màu đẹp hơn"
      },
      commentsList: []
    }
  ];

  // ========== RENDERING FUNCTIONS ==========
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

  // Make renderPost function globally accessible
  window.renderPost = function(post) {
    console.log('🎨 Rendering post:', post.id);
    
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
        ${post.image ? `<img class="feed-post-image" src="${post.image}" alt="post image">` : ''}

        <!-- Post Stats -->
        <div class="feed-post-stats">
          <span class="feed-post-likes">${post.likes} lượt thích</span>
          <span class="feed-post-comments-count">${post.comments} bình luận</span>
          <span class="feed-post-shares">${post.shares} chia sẻ</span>
        </div>

        <!-- Post Actions -->
        <div class="feed-post-actions">
          <button class="feed-action-btn ${post.isLiked ? 'active' : ''}" data-action="like" data-post-id="${post.id}">
            <i class="fas fa-heart"></i>
            <span>${post.isLiked ? 'Đã thích' : 'Thích'}</span>
          </button>
          <button class="feed-action-btn" data-action="comment" data-post-id="${post.id}">
            <i class="fas fa-comment"></i>
            <span>Bình luận</span>
          </button>
          <button class="feed-action-btn" data-action="share" data-post-id="${post.id}">
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
              <input type="text" placeholder="Viết bình luận..." class="comment-input" data-post-id="${post.id}">
              <button class="comment-submit" data-post-id="${post.id}">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  };

  // Render initial posts
  function renderFeed() {
    feed.innerHTML = posts.map(post => renderPost(post)).join('');
    console.log('✅ Feed rendered with', posts.length, 'posts');
  }

  renderFeed();

  // ========== CREATE POST FUNCTIONALITY ==========
  console.log('create-post.js loaded');

  // Lấy các element
  const closeBtn = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const postBtn = document.querySelector('.post-btn');
  const uploadArea = document.querySelector('.upload-area');
  const imageInput = document.querySelector('.image-input');
  const imagePreview = document.querySelector('.image-preview');
  const addIngredientBtn = document.querySelector('.add-ingredient');
  const addStepBtn = document.querySelector('.add-step');

  console.log('Elements found:', {
    feedCard: !!feedCard,
    modal: !!modal,
    postBtn: !!postBtn,
    addIngredientBtn: !!addIngredientBtn,
    addStepBtn: !!addStepBtn
  });

  // 1. MỞ POPUP KHI CLICK VÀO FEED-CARD
  if (feedCard && modal) {
    feedCard.addEventListener('click', function(e) {
      if (!e.target.closest('.btn-post')) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Popup opened');
      }
    });
  }

  // 2. ĐÓNG POPUP
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      resetForm();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // 3. UPLOAD ẢNH
  if (uploadArea && imageInput) {
    uploadArea.addEventListener('click', function() {
      imageInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadArea.style.backgroundColor = '#f0f0f0';
    });

    uploadArea.addEventListener('dragleave', function() {
      uploadArea.style.backgroundColor = '';
    });

    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.style.backgroundColor = '';
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    });

    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) handleImageFile(file);
    });

    function handleImageFile(file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        if (imagePreview) {
          imagePreview.innerHTML = `
            <div style="position:relative; display:inline-block;">
              <img src="${e.target.result}" style="width:100px; height:100px; object-fit:cover; border-radius:8px;">
              <button type="button" class="remove-image" style="position:absolute; top:-8px; right:-8px; background:red; color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-size:14px;">×</button>
            </div>
          `;
          
          const removeBtn = imagePreview.querySelector('.remove-image');
          if (removeBtn) {
            removeBtn.addEventListener('click', function() {
              imagePreview.innerHTML = '';
              imageInput.value = '';
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // 4. THÊM NGUYÊN LIỆU
  function addIngredientField() {
    const ingredientsList = document.querySelector('.ingredients-list');
    if (!ingredientsList) {
      console.error('❌ Không tìm thấy .ingredients-list');
      return;
    }
    
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    ingredientItem.style.display = 'flex';
    ingredientItem.style.gap = '8px';
    ingredientItem.style.marginBottom = '8px';
    ingredientItem.innerHTML = `
      <input type="text" placeholder="Ví dụ: 200g thịt bò" class="ingredient-input" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:4px;">
      <button type="button" class="remove-ingredient" style="background:red; color:white; border:none; border-radius:4px; width:30px; cursor:pointer;">×</button>
    `;
    ingredientsList.appendChild(ingredientItem);

    const removeBtn = ingredientItem.querySelector('.remove-ingredient');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        ingredientItem.remove();
      });
    }
  }

  // 5. THÊM BƯỚC THỰC HIỆN
  function addStepField() {
    const stepsList = document.querySelector('.steps-list');
    if (!stepsList) {
      console.error('❌ Không tìm thấy .steps-list');
      return;
    }
    
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.style.display = 'flex';
    stepItem.style.gap = '8px';
    stepItem.style.marginBottom = '8px';
    stepItem.innerHTML = `
      <input type="text" placeholder="Ví dụ: Ướp thịt với gia vị trong 30 phút" class="step-input" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:4px;">
      <button type="button" class="remove-step" style="background:red; color:white; border:none; border-radius:4px; width:30px; cursor:pointer;">×</button>
    `;
    stepsList.appendChild(stepItem);

    const removeBtn = stepItem.querySelector('.remove-step');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        stepItem.remove();
      });
    }
  }

  // Thêm sự kiện cho nút thêm
  if (addIngredientBtn) {
    addIngredientBtn.addEventListener('click', addIngredientField);
  }
  if (addStepBtn) {
    addStepBtn.addEventListener('click', addStepField);
  }

  // Thêm mặc định
  addIngredientField();
  addStepField();

  // 6. XỬ LÝ ĐĂNG BÀI
  if (postBtn) {
    postBtn.addEventListener('click', function() {
      console.log('=== BẮT ĐẦU ĐĂNG BÀI ===');
      
      // Lấy dữ liệu với kiểm tra an toàn
      const getValue = (selector) => {
        const element = document.querySelector(selector);
        return element && element.value ? element.value.trim() : '';
      };

      const content = getValue('.post-content-input');
      const title = getValue('.recipe-title');
      const difficulty = getValue('.recipe-difficulty') || 'Dễ';
      const prepTime = getValue('.recipe-prep-time');
      const cookTime = getValue('.recipe-cook-time');
      const servings = getValue('.recipe-servings');
      const tips = getValue('.recipe-tips');

      console.log('📝 Form data:', { content, title, difficulty, prepTime, cookTime, servings, tips });

      // Lấy nguyên liệu và bước
      const ingredients = [];
      const steps = [];

      try {
        // Lấy nguyên liệu
        const ingredientInputs = document.querySelectorAll('.ingredient-input');
        console.log('🔍 Found ingredient inputs:', ingredientInputs.length);
        ingredientInputs.forEach(input => {
          if (input && input.value) {
            const value = input.value.trim();
            if (value) ingredients.push(value);
          }
        });

        // Lấy các bước
        const stepInputs = document.querySelectorAll('.step-input');
        console.log('🔍 Found step inputs:', stepInputs.length);
        stepInputs.forEach(input => {
          if (input && input.value) {
            const value = input.value.trim();
            if (value) steps.push(value);
          }
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }

      console.log('📦 Ingredients:', ingredients);
      console.log('👩‍🍳 Steps:', steps);

      // Kiểm tra dữ liệu
      if (!content) {
        alert('❌ Vui lòng nhập nội dung bài đăng!');
        return;
      }
      if (!title) {
        alert('❌ Vui lòng nhập tên món ăn!');
        return;
      }
      if (ingredients.length === 0) {
        alert('❌ Vui lòng thêm ít nhất 1 nguyên liệu!');
        return;
      }
      if (steps.length === 0) {
        alert('❌ Vui lòng thêm ít nhất 1 bước thực hiện!');
        return;
      }

      // Tạo bài đăng
      const newPost = {
        id: Date.now(),
        avatar: "../../assets/home-page/image 1.png",
        name: "Minh Nhựt",
        time: "Vừa xong",
        content: content,
        image: imageInput && imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        recipe: {
          title: title,
          prepTime: prepTime,
          cookTime: cookTime,
          servings: servings,
          difficulty: difficulty,
          ingredients: ingredients,
          steps: steps,
          tips: tips
        },
        commentsList: []
      };

      console.log('✅ New post:', newPost);

      // Thêm vào feed
      if (typeof window.renderPost === 'function') {
        try {
          console.log('🎯 Gọi hàm renderPost...');
          const postHTML = window.renderPost(newPost);
          console.log('✅ HTML generated, length:', postHTML.length);
          
          // Thêm bài đăng mới lên đầu feed
          posts.unshift(newPost);
          renderFeed();
          
          closeModal();
          alert('🎉 Đăng bài thành công!');
        } catch (error) {
          console.error('❌ Lỗi khi render:', error);
          alert('Lỗi khi hiển thị bài đăng: ' + error.message);
        }
      } else {
        console.error('❌ Hàm renderPost không tồn tại!');
        alert('❌ Lỗi: Không thể hiển thị bài đăng - hàm renderPost không tồn tại');
      }
    });
  }

  // 7. RESET FORM
  function resetForm() {
    console.log('Resetting form...');
    
    const contentInput = document.querySelector('.post-content-input');
    const titleInput = document.querySelector('.recipe-title');
    const difficultyInput = document.querySelector('.recipe-difficulty');
    const prepTimeInput = document.querySelector('.recipe-prep-time');
    const cookTimeInput = document.querySelector('.recipe-cook-time');
    const servingsInput = document.querySelector('.recipe-servings');
    const tipsInput = document.querySelector('.recipe-tips');

    if (contentInput) contentInput.value = '';
    if (titleInput) titleInput.value = '';
    if (difficultyInput) difficultyInput.value = 'Dễ';
    if (prepTimeInput) prepTimeInput.value = '';
    if (cookTimeInput) cookTimeInput.value = '';
    if (servingsInput) servingsInput.value = '';
    if (tipsInput) tipsInput.value = '';
    
    const ingredientsList = document.querySelector('.ingredients-list');
    const stepsList = document.querySelector('.steps-list');
    if (ingredientsList) ingredientsList.innerHTML = '';
    if (stepsList) stepsList.innerHTML = '';
    
    if (imagePreview) imagePreview.innerHTML = '';
    if (imageInput) imageInput.value = '';
    
    addIngredientField();
    addStepField();
    
    console.log('Form reset completed');
  }

  // ========== FEED INTERACTIONS ==========
  feed.addEventListener('click', (e) => {
    const button = e.target.closest('.feed-action-btn');
    if (button) {
      const action = button.dataset.action;
      const postId = parseInt(button.dataset.postId);
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      if (action === 'like') {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        renderFeed();
      } else if (action === 'comment') {
        const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        if (commentInput) commentInput.focus();
      } else if (action === 'share') {
        post.shares += 1;
        renderFeed();
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
        renderFeed();
      }
    }
  });

  // ========== SEARCH FUNCTIONALITY ==========
  const searchInput = document.querySelector('.header-search_bar input');
  const searchBtn = document.querySelector('.header-search_btn');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
      renderFeed();
      return;
    }

    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm) ||
      (post.recipe && post.recipe.title.toLowerCase().includes(searchTerm)) ||
      (post.recipe && post.recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      ))
    );

    feed.innerHTML = filteredPosts.map(post => renderPost(post)).join('');
    console.log('🔍 Search results:', filteredPosts.length, 'posts found');
  }

  console.log('✅ Feed demo initialized successfully');
});