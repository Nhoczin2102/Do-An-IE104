  // ========== TEMPLATE RENDERER ==========
  export class TemplateRenderer {
    constructor() {
      this.templates = {
        post: document.getElementById('postTemplate'),
        recipe: document.getElementById('recipeTemplate'),
        comment: document.getElementById('commentTemplate')
      };
      
      console.log('📄 Templates loaded:', {
        post: !!this.templates.post,
        recipe: !!this.templates.recipe,
        comment: !!this.templates.comment
      });
    }

    renderPost(post) {
      console.log('🎨 Rendering post:', post.id);
      
      if (!this.templates.post) {
        console.error('❌ Post template not found');
        return '<div>Template error</div>';
      }

      let template = this.templates.post.innerHTML;

      // Replace all placeholders with actual data
      const html = template
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

      return html;
    }

    renderRecipe(recipe) {
      if (!recipe) return '';
      
      if (!this.templates.recipe) {
        console.error('❌ Recipe template not found');
        return '<div>Recipe template error</div>';
      }

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
      if (!this.templates.comment) {
        console.error('❌ Comment template not found');
        return '<div>Comment template error</div>';
      }

      let template = this.templates.comment.innerHTML;

      return template
        .replace(/{avatar}/g, comment.avatar)
        .replace(/{name}/g, comment.name)
        .replace(/{time}/g, comment.time)
        .replace(/{content}/g, this.escapeHtml(comment.content));
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
      if (!unsafe) return '';
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }


