import { TemplateRenderer } from './templateRender.js';
import { samplePosts } from '../data/data.js';

export class PostManager {
    constructor() {
        this.posts = [...samplePosts];
        this.renderer = new TemplateRenderer();
        this.feed = document.getElementById("feed");
    }

    init() {
        this.renderFeed();
        this.bindEvents();
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
            const newComment = {
                id: Date.now(),
                avatar: "../../assets/images/avatar.png",
                name: "Minh Nhựt",
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
            post.content.toLowerCase().includes(searchTerm) ||
            (post.recipe && post.recipe.title.toLowerCase().includes(searchTerm)) ||
            (post.recipe && post.recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm)
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
            const button = e.target.closest('.feed-action-btn');
            if (button) {
                const action = button.dataset.action;
                const postId = parseInt(button.dataset.postId);
                
                if (action === 'like') {
                    this.likePost(postId);
                } else if (action === 'comment') {
                    const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                    if (commentInput) commentInput.focus();
                } else if (action === 'share') {
                    if (this.sharePost(postId)) {
                        alert('Đã chia sẻ bài viết!');
                    }
                }
            }

            // Xử lý gửi bình luận
            const commentSubmit = e.target.closest('.comment-submit');
            if (commentSubmit) {
                const postId = parseInt(commentSubmit.dataset.postId);
                const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                
                if (commentInput && commentInput.value.trim()) {
                    this.addComment(postId, commentInput.value);
                    commentInput.value = '';
                }
            }
        });
    }

    getPosts() {
        return this.posts;
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
}