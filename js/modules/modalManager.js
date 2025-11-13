export class ModalManager {
    constructor(postManager) {
        this.postManager = postManager;
        this.modal = document.getElementById('createPostModal');
        this.feedComposer = document.querySelector('.feed__composer');
        this.initializeElements();
    }

    initializeElements() {
        // Lấy các element với class BEM
        this.closeBtn = document.querySelector('.modal__close');
        this.cancelBtn = document.querySelector('.modal__cancel-btn');
        this.postBtn = document.querySelector('.modal__post-btn');
        this.uploadArea = document.querySelector('.modal__upload-area');
        this.imageInput = document.querySelector('.modal__image-input');
        this.imagePreview = document.querySelector('.modal__image-preview');
        this.addIngredientBtn = document.querySelector('.modal__add-ingredient');
        this.addStepBtn = document.querySelector('.modal__add-step');

        console.log('Modal elements found:', {
            feedComposer: !!this.feedComposer,
            modal: !!this.modal,
            postBtn: !!this.postBtn,
            addIngredientBtn: !!this.addIngredientBtn,
            addStepBtn: !!this.addStepBtn
        });

        this.bindEvents();
        this.addDefaultFields();
    }

    bindEvents() {
        // Mở popup - SỬA: feed__composer
        if (this.feedComposer && this.modal) {
            this.feedComposer.addEventListener('click', (e) => {
                if (!e.target.closest('.feed__composer-button')) {
                    this.openModal();
                }
            });
        }

        // Đóng popup
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Upload ảnh - SỬA: modal__upload-area
        if (this.uploadArea && this.imageInput) {
            this.uploadArea.addEventListener('click', () => this.imageInput.click());
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.style.backgroundColor = '#f0f0f0';
            });
            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.style.backgroundColor = '';
            });
            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.style.backgroundColor = '';
                const file = e.dataTransfer.files[0];
                if (file) this.handleImageFile(file);
            });
            this.imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.handleImageFile(file);
            });
        }

        // Thêm nguyên liệu và bước - SỬA: modal__add-ingredient, modal__add-step
        if (this.addIngredientBtn) {
            this.addIngredientBtn.addEventListener('click', () => this.addIngredientField());
        }
        if (this.addStepBtn) {
            this.addStepBtn.addEventListener('click', () => this.addStepField());
        }

        // Đăng bài
        if (this.postBtn) {
            this.postBtn.addEventListener('click', () => this.handlePost());
        }
    }

    openModal() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Popup opened');
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.resetForm();
        }
    }

    handleImageFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.imagePreview) {
                this.imagePreview.innerHTML = `
                    <div style="position:relative; display:inline-block;">
                        <img src="${e.target.result}" style="width:100px; height:100px; object-fit:cover; border-radius:8px;">
                        <button type="button" class="modal__remove-image" style="position:absolute; top:-8px; right:-8px; background:red; color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-size:14px;">×</button>
                    </div>
                `;
                
                const removeBtn = this.imagePreview.querySelector('.modal__remove-image');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        this.imagePreview.innerHTML = '';
                        this.imageInput.value = '';
                    });
                }
            }
        };
        reader.readAsDataURL(file);
    }

    addIngredientField() {
        const ingredientsList = document.querySelector('.modal__ingredients-list');
        if (!ingredientsList) {
            console.error('❌ Không tìm thấy .modal__ingredients-list');
            return;
        }
        
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'modal__ingredient-item';
        ingredientItem.style.display = 'flex';
        ingredientItem.style.gap = '8px';
        ingredientItem.style.marginBottom = '8px';
        ingredientItem.innerHTML = `
            <input type="text" placeholder="Ví dụ: 200g thịt bò" class="modal__ingredient-input" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:4px;">
            <button type="button" class="modal__remove-ingredient" style="background:red; color:white; border:none; border-radius:4px; width:30px; cursor:pointer;">×</button>
        `;
        ingredientsList.appendChild(ingredientItem);

        const removeBtn = ingredientItem.querySelector('.modal__remove-ingredient');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                ingredientItem.remove();
            });
        }
    }

    addStepField() {
        const stepsList = document.querySelector('.modal__steps-list');
        if (!stepsList) {
            console.error('❌ Không tìm thấy .modal__steps-list');
            return;
        }
        
        const stepItem = document.createElement('div');
        stepItem.className = 'modal__step-item';
        stepItem.style.display = 'flex';
        stepItem.style.gap = '8px';
        stepItem.style.marginBottom = '8px';
        stepItem.innerHTML = `
            <input type="text" placeholder="Ví dụ: Ướp thịt với gia vị trong 30 phút" class="modal__step-input" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:4px;">
            <button type="button" class="modal__remove-step" style="background:red; color:white; border:none; border-radius:4px; width:30px; cursor:pointer;">×</button>
        `;
        stepsList.appendChild(stepItem);

        const removeBtn = stepItem.querySelector('.modal__remove-step');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                stepItem.remove();
            });
        }
    }

    addDefaultFields() {
        this.addIngredientField();
        this.addStepField();
    }

    handlePost() {
        console.log('=== BẮT ĐẦU ĐĂNG BÀI ===');
        
        // Lấy dữ liệu form
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        // Tạo bài đăng mới
        const newPost = this.createNewPost(formData);
        console.log('✅ New post:', newPost);

        // Thêm vào feed
        this.postManager.addPost(newPost);
        this.closeModal();
        alert('🎉 Đăng bài thành công!');
    }

    getFormData() {
        const getValue = (selector) => {
            const element = document.querySelector(selector);
            return element && element.value ? element.value.trim() : '';
        };

        const content = getValue('.modal__content-input');
        const title = getValue('.modal__recipe-title-input');
        const difficulty = getValue('.modal__recipe-difficulty') || 'Dễ';
        const prepTime = getValue('.modal__recipe-prep-time');
        const cookTime = getValue('.modal__recipe-cook-time');
        const servings = getValue('.modal__recipe-servings');
        const tips = getValue('.modal__recipe-tips');

        // Lấy nguyên liệu và bước
        const ingredients = [];
        const steps = [];

        try {
            const ingredientInputs = document.querySelectorAll('.modal__ingredient-input');
            ingredientInputs.forEach(input => {
                if (input && input.value) {
                    const value = input.value.trim();
                    if (value) ingredients.push(value);
                }
            });

            const stepInputs = document.querySelectorAll('.modal__step-input');
            stepInputs.forEach(input => {
                if (input && input.value) {
                    const value = input.value.trim();
                    if (value) steps.push(value);
                }
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }

        return {
            content,
            title,
            difficulty,
            prepTime,
            cookTime,
            servings,
            tips,
            ingredients,
            steps
        };
    }

    validateForm(formData) {
        const { content, title, ingredients, steps } = formData;

        if (!content) {
            alert('❌ Vui lòng nhập nội dung bài đăng!');
            return false;
        }
        if (!title) {
            alert('❌ Vui lòng nhập tên món ăn!');
            return false;
        }
        if (ingredients.length === 0) {
            alert('❌ Vui lòng thêm ít nhất 1 nguyên liệu!');
            return false;
        }
        if (steps.length === 0) {
            alert('❌ Vui lòng thêm ít nhất 1 bước thực hiện!');
            return false;
        }

        return true;
    }

    createNewPost(formData) {
        const { content, title, difficulty, prepTime, cookTime, servings, tips, ingredients, steps } = formData;

        return {
            id: Date.now(),
            avatar: "../../assets/images/avatar.png",
            name: "Minh Nhựt",
            time: "Vừa xong",
            content: content,
            image: this.imageInput && this.imageInput.files[0] ? 
                URL.createObjectURL(this.imageInput.files[0]) : 
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
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
    }

    resetForm() {
        console.log('Resetting form...');
        
        const contentInput = document.querySelector('.modal__content-input');
        const titleInput = document.querySelector('.modal__recipe-title-input');
        const difficultyInput = document.querySelector('.modal__recipe-difficulty');
        const prepTimeInput = document.querySelector('.modal__recipe-prep-time');
        const cookTimeInput = document.querySelector('.modal__recipe-cook-time');
        const servingsInput = document.querySelector('.modal__recipe-servings');
        const tipsInput = document.querySelector('.modal__recipe-tips');

        if (contentInput) contentInput.value = '';
        if (titleInput) titleInput.value = '';
        if (difficultyInput) difficultyInput.value = 'Dễ';
        if (prepTimeInput) prepTimeInput.value = '';
        if (cookTimeInput) cookTimeInput.value = '';
        if (servingsInput) servingsInput.value = '';
        if (tipsInput) tipsInput.value = '';
        
        const ingredientsList = document.querySelector('.modal__ingredients-list');
        const stepsList = document.querySelector('.modal__steps-list');
        if (ingredientsList) ingredientsList.innerHTML = '';
        if (stepsList) stepsList.innerHTML = '';
        
        if (this.imagePreview) this.imagePreview.innerHTML = '';
        if (this.imageInput) this.imageInput.value = '';
        
        this.addDefaultFields();
        
        console.log('Form reset completed');
    }
}