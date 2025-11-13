export class TemplateRenderer {
    constructor() {
        this.templates = {
            post: document.getElementById('postTemplate'),
            recipe: document.getElementById('recipeTemplate'),
            comment: document.getElementById('commentTemplate')
        };
        
        this.initTemplates();
    }

    initTemplates() {
        // Fallback templates
        if (!this.templates.post) {
            this.templates.post = this.createFallbackPostTemplate();
        }
        if (!this.templates.recipe) {
            this.templates.recipe = this.createFallbackRecipeTemplate();
        }
        if (!this.templates.comment) {
            this.templates.comment = this.createFallbackCommentTemplate();
        }
        
        console.log('📄 Templates loaded:', Object.keys(this.templates));
    }

    renderPost(post) {
        console.log('🎨 Rendering post:', post.id);
        
        let template = this.templates.post.innerHTML;

        return template
            .replace(/{id}/g, post.id)
            .replace(/{avatar}/g, post.avatar)
            .replace(/{name}/g, post.name)
            .replace(/{time}/g, post.time)
            .replace(/{content}/g, post.content)
            .replace(/{likes}/g, post.likes)
            .replace(/{comments}/g, post.comments)
            .replace(/{shares}/g, post.shares)
            .replace(/{likeClass}/g, post.isLiked ? 'feed-post__action-btn--liked' : '')
            .replace(/{likeText}/g, post.isLiked ? 'Đã thích' : 'Thích')
            .replace('{recipeSection}', this.renderRecipe(post.recipe))
            .replace('{imageSection}', post.image ? 
                `<img class="feed-post__image" src="${post.image}" alt="post image">` : '')
            .replace('{cookModeButton}', post.recipe ? `
                <button class="feed-post__action-btn feed-post__cookmode-btn" data-action="cookmode" data-post-id="${post.id}">
                    <i class="fas fa-utensils feed-post__action-icon"></i>
                    <span class="feed-post__action-text">COOK Mode</span>
                </button>
            ` : '')
            .replace('{commentsList}', post.commentsList.map(comment => 
                this.renderComment(comment)).join(''));
    }

    renderRecipe(recipe) {
        if (!recipe) return '';
        
        let template = this.templates.recipe.innerHTML;

        return template
            .replace(/{title}/g, recipe.title)
            .replace(/{prepTime}/g, recipe.prepTime)
            .replace(/{cookTime}/g, recipe.cookTime)
            .replace(/{servings}/g, recipe.servings)
            .replace(/{difficulty}/g, recipe.difficulty)
            .replace('{ingredientsList}', recipe.ingredients.map(ingredient => 
                `<li>${this.escapeHtml(ingredient)}</li>`).join(''))
            .replace('{stepsList}', recipe.steps.map(step => 
                `<li>${this.escapeHtml(step)}</li>`).join(''))
            .replace('{tipsSection}', recipe.tips ? `
                <div class="feed-post__recipe-tips">
                    <strong>💡 Mẹo:</strong> <span>${this.escapeHtml(recipe.tips)}</span>
                </div>
            ` : '');
    }

    renderComment(comment) {
        let template = this.templates.comment.innerHTML;

        return template
            .replace(/{avatar}/g, comment.avatar)
            .replace(/{name}/g, comment.name)
            .replace(/{time}/g, comment.time)
            .replace(/{content}/g, this.escapeHtml(comment.content));
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Fallback templates với class BEM
    createFallbackPostTemplate() {
        const template = document.createElement('div');
        template.innerHTML = `
            <article class="feed-post" data-post-id="{id}">
                <div class="feed-post__header">
                    <img class="feed-post__avatar" src="{avatar}" alt="avatar">
                    <div class="feed-post__user">
                        <strong class="feed-post__name">{name}</strong>
                        <div class="feed-post__time">{time}</div>
                    </div>
                </div>
                <div class="feed-post__content">
                    <p>{content}</p>
                    {imageSection}
                </div>
                {recipeSection}
                <div class="feed-post__stats">
                    <span class="feed-post__likes">{likes} lượt thích</span>
                    <span class="feed-post__comments-count">{comments} bình luận</span>
                    <span class="feed-post__shares">{shares} chia sẻ</span>
                </div>
                <div class="feed-post__actions">
                    <button class="feed-post__action-btn {likeClass}" data-action="like" data-post-id="{id}">
                        <i class="fas fa-heart feed-post__action-icon"></i>
                        <span class="feed-post__action-text">{likeText}</span>
                    </button>
                    <button class="feed-post__action-btn" data-action="comment" data-post-id="{id}">
                        <i class="fas fa-comment feed-post__action-icon"></i>
                        <span class="feed-post__action-text">Bình luận</span>
                    </button>
                    <button class="feed-post__action-btn" data-action="share" data-post-id="{id}">
                        <i class="fas fa-share feed-post__action-icon"></i>
                        <span class="feed-post__action-text">Chia sẻ</span>
                    </button>
                    {cookModeButton}
                </div>
                <div class="feed-post__comments">
                    <div class="feed-post__comments-list">{commentsList}</div>
                    <div class="feed-post__comment-input">
                        <img class="feed-post__comment-avatar" src="./assets/images/avatar.png" alt="Your avatar">
                        <div class="feed-post__comment-input-wrapper">
                            <input type="text" class="feed-post__comment-input-field" data-post-id="{id}" placeholder="Viết bình luận...">
                            <button class="feed-post__comment-submit" data-post-id="{id}">
                                <i class="fas fa-paper-plane feed-post__comment-submit-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
        return template;
    }

    createFallbackRecipeTemplate() {
        const template = document.createElement('div');
        template.innerHTML = `
            <div class="feed-post__recipe">
                <h4 class="feed-post__recipe-title">🍴 {title}</h4>
                <div class="feed-post__recipe-info">
                    <div class="feed-post__recipe-info-item">⏱️ Chuẩn bị: {prepTime}</div>
                    <div class="feed-post__recipe-info-item">🔥 Nấu: {cookTime}</div>
                    <div class="feed-post__recipe-info-item">👥 Khẩu phần: {servings}</div>
                    <div class="feed-post__recipe-info-item">📊 Độ khó: {difficulty}</div>
                </div>
                <div class="feed-post__recipe-details">
                    <div class="feed-post__ingredients">
                        <h5 class="feed-post__ingredients-title">📝 Nguyên liệu:</h5>
                        <ul class="feed-post__ingredients-list">{ingredientsList}</ul>
                    </div>
                    <div class="feed-post__steps">
                        <h5 class="feed-post__steps-title">👩‍🍳 Các bước thực hiện:</h5>
                        <ol class="feed-post__steps-list">{stepsList}</ol>
                    </div>
                </div>
                {tipsSection}
            </div>
        `;
        return template;
    }

    createFallbackCommentTemplate() {
        const template = document.createElement('div');
        template.innerHTML = `
            <div class="feed-post__comment">
                <img class="feed-post__comment-avatar" src="{avatar}" alt="avatar">
                <div class="feed-post__comment-content">
                    <div class="feed-post__comment-header">
                        <strong class="feed-post__comment-name">{name}</strong>
                        <span class="feed-post__comment-time">{time}</span>
                    </div>
                    <p class="feed-post__comment-text">{content}</p>
                </div>
            </div>
        `;
        return template;
    }
}