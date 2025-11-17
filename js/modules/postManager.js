import { TemplateRenderer } from './templateRender.js';
import { getCurrentUser } from './auth.js';

export class PostManager {
    constructor() {
        this.posts = [];
        this.renderer = new TemplateRenderer();
        this.feed = document.querySelector(".feed__posts");
        this.currentUser = getCurrentUser();
        
        // Cập nhật user cho renderer
        if (this.renderer.updateCurrentUser) {
            this.renderer.updateCurrentUser(this.currentUser);
        }
    }

    async init() {
        await this.loadPosts();
        this.renderFeed();
        this.bindEvents();
    }

    // Tải dữ liệu bài viết
    async loadPosts() {
        try {
            const response = await fetch('../../data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.posts = await response.json();
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu posts.json:', error);
            if (this.feed) {
                this.feed.innerHTML = "<p>Không thể tải được bài viết.</p>"
            }
        }
    }

    // Render danh sách bài viết
    renderFeed() {
        if (!this.feed) return;
        this.feed.innerHTML = this.posts.map(post => this.renderer.renderPost(post)).join('');
    }

    addPost(newPost) {
        this.posts.unshift(newPost);
        this.renderFeed();
    }

    // Xử lý like
    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.isLiked = !post.isLiked;
            post.likes += post.isLiked ? 1 : -1;
            this.renderFeed();
        }
    }

    // Xử lý share
    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.shares += 1;
            this.renderFeed();
            return true;
        }
        return false;
    }

    // Thêm bình luận
    addComment(postId, commentContent) {
        const post = this.posts.find(p => p.id === postId);
        if (post && commentContent.trim()) {
            if (!post.commentsList) {
                post.commentsList = [];
            }
            
            if (!this.currentUser) {
                alert('Vui lòng đăng nhập để bình luận!');
                return false;
            }
            
            const newComment = {
                id: Date.now(),
                avatar: this.currentUser.avatar || "./assets/images/avatar.png",
                name: this.currentUser.name || "Minh Nhựt",
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

    // Tìm kiếm bài viết
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
        
        return filteredPosts;
    }

    // Gắn sự kiện
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

    // Cập nhật user hiện tại
    updateCurrentUser() {
        this.currentUser = getCurrentUser();
        if (this.renderer.updateCurrentUser) {
            this.renderer.updateCurrentUser(this.currentUser);
        }
        this.renderFeed();
    }

    getPosts() {
        return this.posts;
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
}