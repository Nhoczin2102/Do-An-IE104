import { TemplateRenderer } from './templateRender.js';
import { getCurrentUser } from './auth.js'; // THÊM: Import hàm lấy user hiện tại

export class PostManager {
    constructor() {
        this.posts = []; // THAY ĐỔI: Khởi tạo mảng rỗng**
        this.renderer = new TemplateRenderer(); // SỬA: == thành =
        this.feed = document.querySelector(".feed__posts");
        this.currentUser = getCurrentUser(); // THÊM: Lấy user hiện tại
    }

    // THAY ĐỔI: Chuyển init thành async**
    async init() {
        await this.loadPosts(); // THÊM: Chờ tải dữ liệu**
        this.renderFeed();
        this.bindEvents();
    }

    // THÊM: Hàm mới để tải dữ liệu từ JSON**
    async loadPosts() {
        try {
            // Đường dẫn trỏ đến file JSON mới**
            const response = await fetch('../../js/data/data.json'); // SỬA: ../ thành ./
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.posts = await response.json(); // Gán dữ liệu vào this.posts**
            console.log('✅ Dữ liệu bài viết đã được tải:', this.posts.length, 'bài viết');
        } catch (error) {
            console.error('❌ Lỗi khi tải dữ liệu posts.json:', error);
            if (this.feed) {
                this.feed.innerHTML = "<p>Không thể tải được bài viết.</p>"
            }
        }
    }

    renderFeed() {
        if (!this.feed) {
            console.error('❌ Không tìm thấy feed element');
            return;
        }

        console.log('🔄 Rendering feed with', this.posts.length, 'posts');
        this.feed.innerHTML = this.posts.map(post => this.renderer.renderPost(post)).join('');
        console.log('✅ Feed rendered successfully');
    }

    addPost(newPost) {
        this.posts.unshift(newPost);
        this.renderFeed();
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.isLiked = !post.isLiked;
            post.likes += post.isLiked ? 1 : -1;
            this.renderFeed();
        }
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.shares += 1;
            this.renderFeed();
            return true;
        }
        return false;
    }

    addComment(postId, commentContent) {
        const post = this.posts.find(p => p.id === postId);
        if (post && commentContent.trim()) {
            // SỬA: Đảm bảo commentsList tồn tại
            if (!post.commentsList) {
                post.commentsList = [];
            }
            
            // THÊM: Kiểm tra user đã đăng nhập chưa
            if (!this.currentUser) {
                alert('Vui lòng đăng nhập để bình luận!');
                return false;
            }
            
            const newComment = {
                id: Date.now(),
                avatar: this.currentUser.avatar || "./assets/images/avatar.png", // THÊM: Sử dụng avatar của user hiện tại
                name: this.currentUser.name || "Minh Nhựt", // THÊM: Sử dụng name của user hiện tại
                time: "Vừa xong",
                content: commentContent.trim()
            };
            
            post.commentsList.push(newComment);
            post.comments += 1;
            this.renderFeed();
            return true;
        }
        return false;
    }

    searchPosts(searchTerm) {
        if (!searchTerm) {
            this.renderFeed();
            return this.posts;
        }

        const filteredPosts = this.posts.filter(post => 
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.recipe && post.recipe.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.recipe && post.recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );

        if (this.feed) {
            this.feed.innerHTML = filteredPosts.map(post => this.renderer.renderPost(post)).join('');
        }
        
        console.log('🔍 Search results:', filteredPosts.length, 'posts found');
        return filteredPosts;
    }

    bindEvents() {
        if (!this.feed) return;

        this.feed.addEventListener('click', (e) => {
            const button = e.target.closest('.feed-post__action-btn');
            if (button) {
                const action = button.dataset.action;
                const postId = parseInt(button.dataset.postId);
                
                if (action === 'like') {
                    this.likePost(postId);
                } else if (action === 'comment') {
                    const commentInput = document.querySelector(`.feed-post__comment-input-field[data-post-id="${postId}"]`);
                    if (commentInput) commentInput.focus();
                } else if (action === 'share') {
                    if (this.sharePost(postId)) {
                        alert('Đã chia sẻ bài viết!');
                    }
                }
            }

            // Xử lý gửi bình luận
            const commentSubmit = e.target.closest('.feed-post__comment-submit');
            if (commentSubmit) {
                const postId = parseInt(commentSubmit.dataset.postId);
                const commentInput = document.querySelector(`.feed-post__comment-input-field[data-post-id="${postId}"]`);
                
                if (commentInput && commentInput.value.trim()) {
                    this.addComment(postId, commentInput.value);
                    commentInput.value = '';
                }
            }
        });
    }

    // THÊM: Hàm cập nhật user hiện tại
    updateCurrentUser() {
        this.currentUser = getCurrentUser();
        console.log('🔄 PostManager: Cập nhật user hiện tại', this.currentUser);
    }

    getPosts() {
        return this.posts;
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
}