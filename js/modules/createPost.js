// Import "Dữ liệu" để CẬP NHẬT
import { posts } from '../data/posts.js';
// Import "Hàm Render" để LÀM MỚI feed
import { renderFeed } from './feed.js';

// ----- KHÔNG CÓ BIẾN DOM NÀO Ở CẤP CAO NHẤT -----
// (Tất cả đã được chuyển vào bên trong hàm init)

/**
 * HÀM "MỤC LỤC" CỦA FILE NÀY
 * (File home.js sẽ gọi hàm này)
 */
export function initCreatePost() {
  
  // ✅ BƯỚC 1: LẤY BIẾN DOM Ở ĐÂY
  // Code này chỉ chạy KHI HÀM ĐƯỢC GỌI (lúc này HTML đã được tải)
  const modal = document.getElementById('createPostModal');
  
  // Kiểm tra an toàn ngay lập tức
  if (!modal) {
    console.warn('⚠️ Không tìm thấy Modal tạo bài đăng.');
    return;
  }
  
  // Giờ modal đã tồn tại, chúng ta có thể query các phần tử bên trong nó
  const feedCard = document.querySelector('.feed-card'); // Cái này có thể vẫn ở ngoài
  const closeBtn = modal.querySelector('.close-modal');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const postBtn = modal.querySelector('.post-btn');
  const uploadArea = modal.querySelector('.upload-area');
  const imageInput = modal.querySelector('.image-input');
  const imagePreview = modal.querySelector('.image-preview');
  const addIngredientBtn = modal.querySelector('.add-ingredient');
  const addStepBtn = modal.querySelector('.add-step');
  
  // Input fields
  const postContentInput = modal.querySelector('.post-content-input');
  const recipeTitleInput = modal.querySelector('.recipe-title');
  const recipePrepTimeInput = modal.querySelector('.recipe-prep-time');
  const recipeCookTimeInput = modal.querySelector('.recipe-cook-time');
  const recipeServingsInput = modal.querySelector('.recipe-servings');
  const recipeDifficultyInput = modal.querySelector('.recipe-difficulty');
  const recipeTipsInput = modal.querySelector('.recipe-tips-input');
  const ingredientsList = modal.querySelector('.ingredients-list');
  const stepsList = modal.querySelector('.steps-list');

  console.log('📝 Create Post module initialized');

  // ✅ BƯỚC 2: CHUYỂN CÁC HÀM CON VÀO BÊN TRONG
  // (Hoặc truyền các biến vào, nhưng chuyển vào trong dễ hơn)

  /**
   * 1. MỞ POPUP KHI CLICK VÀO FEED-CARD
   */
  function bindOpenModal() {
    // feedCard có thể được query từ document, không nhất thiết từ modal
    const feedCardToClick = document.querySelector('.feed-card'); 
    if (feedCardToClick && modal) {
      feedCardToClick.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-post')) {
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          console.log('Popup opened');
        }
      });
    }
  }

  /**
   * 2. ĐÓNG POPUP
   */
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      resetForm();
    }
  }

  function bindCloseModal() {
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
  }

  /**
   * 3. UPLOAD ẢNH
   */
  function handleImageFile(file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      if (imagePreview) {
        imagePreview.innerHTML = `... (code y nguyên) ...`;
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

  function bindUploadEvents() {
    if (uploadArea && imageInput) {
      uploadArea.addEventListener('click', () => imageInput.click());
      // ... (code y nguyên) ...
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
      });
    }
  }

  /**
   * 4. THÊM NGUYÊN LIỆU & BƯỚC
   */
  function addIngredientField() {
    if (!ingredientsList) return;
    const ingredientItem = document.createElement('div');
    // ... (code y nguyên) ...
    ingredientItem.innerHTML = `... (code y nguyên) ...`;
    ingredientsList.appendChild(ingredientItem);
    ingredientItem.querySelector('.remove-ingredient')
      .addEventListener('click', () => ingredientItem.remove());
  }

  function addStepField() {
    if (!stepsList) return;
    const stepItem = document.createElement('div');
    // ... (code y nguyên) ...
    stepItem.innerHTML = `... (code y nguyên) ...`;
    stepsList.appendChild(stepItem);
    stepItem.querySelector('.remove-step')
      .addEventListener('click', () => stepItem.remove());
  }

  function bindAddFields() {
    if (addIngredientBtn) addIngredientBtn.addEventListener('click', addIngredientField);
    if (addStepBtn) addStepBtn.addEventListener('click', addStepField);
    addIngredientField();
    addStepField();
  }

  /**
   * 6. XỬ LÝ ĐĂNG BÀI
   */
  function bindPostButton() {
    if (postBtn) {
      postBtn.addEventListener('click', function() {
        console.log('=== BẮT ĐẦU ĐĂNG BÀI ===');
        
        // Giờ các biến này đã tồn tại
        const content = postContentInput.value.trim();
        const title = recipeTitleInput.value.trim();
        
        if (!content || !title) {
          alert('❌ Vui lòng nhập nội dung và tên món ăn!');
          return;
        }
        
        const ingredients = Array.from(ingredientsList.querySelectorAll('.ingredient-input'))
                              .map(input => input.value.trim()).filter(val => val);
        const steps = Array.from(stepsList.querySelectorAll('.step-input'))
                              .map(input => input.value.trim()).filter(val => val);

        if (ingredients.length === 0 || steps.length === 0) {
          alert('❌ Vui lòng thêm ít nhất 1 nguyên liệu và 1 bước!');
          return;
        }

        const newPost = {
          id: Date.now(),
          avatar: "/assets/home-page/image_1.png", // ✅ Đã sửa đường dẫn
          name: "Minh Nhựt",
          time: "Vừa xong",
          content: content,
          image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          recipe: {
            title: title,
            prepTime: recipePrepTimeInput.value.trim(),
            cookTime: recipeCookTimeInput.value.trim(),
            servings: recipeServingsInput.value.trim(),
            difficulty: recipeDifficultyInput.value.trim() || 'Dễ',
            ingredients: ingredients,
            steps: steps,
            tips: recipeTipsInput.value.trim()
          },
          commentsList: []
        };

        posts.unshift(newPost);
        renderFeed(posts);
        closeModal();
        alert('🎉 Đăng bài thành công!');
      });
    }
  }

  /**
   * 7. RESET FORM
   */
  function resetForm() {
    console.log('Resetting form...');
    
    postContentInput.value = '';
    recipeTitleInput.value = '';
    recipeDifficultyInput.value = 'Dễ';
    recipePrepTimeInput.value = '';
    recipeCookTimeInput.value = '';
    recipeServingsInput.value = '';
    recipeTipsInput.value = '';
    
    if (ingredientsList) ingredientsList.innerHTML = '';
    if (stepsList) stepsList.innerHTML = '';
    
    if (imagePreview) imagePreview.innerHTML = '';
    if (imageInput) imageInput.value = '';
    
    addIngredientField();
    addStepField();
  }

  // ✅ BƯỚC 3: GỌI CÁC HÀM CON
  bindOpenModal();
  bindCloseModal();
  bindUploadEvents();
  bindAddFields();
  bindPostButton();
}