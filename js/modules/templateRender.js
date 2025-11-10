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
            .replace(/{likeClass}/g, post.isLiked ? 'active' : '')
            .replace(/{likeText}/g, post.isLiked ? 'Đã thích' : 'Thích')
            .replace('{recipeSection}', this.renderRecipe(post.recipe))
            .replace('{imageSection}', post.image ? 
                `<img class="feed-post-image" src="${post.image}" alt="post image">` : '')
            .replace('{cookModeButton}', post.recipe ? `
                <button class="feed-action-btn cook-mode-btn" data-action="cookmode" data-post-id="${post.id}">
                    <i class="fas fa-utensils"></i>
                    <span>COOK Mode</span>
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
                <div class="recipe-tips">
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

    // Fallback templates
    createFallbackPostTemplate() {
        const template = document.createElement('div');
        template.innerHTML = `
            <div class="feed-post" data-post-id="{id}">
                <div class="feed-post-header">
                    <img class="feed-post-avatar" src="{avatar}" alt="avatar">
                    <div class="feed-post-info">
                        <div class="feed-post-name">{name}</div>
                        <div class="feed-post-time">{time}</div>
                    </div>
                </div>
                <div class="feed-post-content">
                    <p>{content}</p>
                    {imageSection}
                </div>
                {recipeSection}
                <div class="feed-post-actions">
                    <button class="feed-action-btn {likeClass}" data-action="like" data-post-id="{id}">
                        <i class="fas fa-heart"></i>
                        <span>{likeText}</span>
                        <span class="action-count">{likes}</span>
                    </button>
                    <button class="feed-action-btn" data-action="comment" data-post-id="{id}">
                        <i class="fas fa-comment"></i>
                        <span>Bình luận</span>
                        <span class="action-count">{comments}</span>
                    </button>
                    <button class="feed-action-btn" data-action="share" data-post-id="{id}">
                        <i class="fas fa-share"></i>
                        <span>Chia sẻ</span>
                        <span class="action-count">{shares}</span>
                    </button>
                    {cookModeButton}
                </div>
                <div class="feed-post-comments">
                    <div class="comments-list">{commentsList}</div>
                    <div class="comment-input-container">
                        <input type="text" class="comment-input" data-post-id="{id}" placeholder="Viết bình luận...">
                        <button class="comment-submit" data-post-id="{id}">Gửi</button>
                    </div>
                </div>
            </div>
        `;
        return template;
    }

    createFallbackRecipeTemplate() {
        const template = document.createElement('div');
        template.innerHTML = `
            <div class="recipe-section">
                <h4>🍴 {title}</h4>
                <div class="recipe-info">
                    <div>⏱️ Chuẩn bị: {prepTime}</div>
                    <div>🔥 Nấu: {cookTime}</div>
                    <div>👥 Khẩu phần: {servings}</div>
                    <div>📊 Độ khó: {difficulty}</div>
                </div>
                <div class="recipe-details">
                    <div class="ingredients">
                        <h5>📝 Nguyên liệu:</h5>
                        <ul>{ingredientsList}</ul>
                    </div>
                    <div class="steps">
                        <h5>👩‍🍳 Các bước thực hiện:</h5>
                        <ol>{stepsList}</ol>
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
            <div class="comment">
                <img class="comment-avatar" src="{avatar}" alt="avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-name">{name}</span>
                        <span class="comment-time">{time}</span>
                    </div>
                    <p class="comment-text">{content}</p>
                </div>
            </div>
        `;
        return template;
    }
}