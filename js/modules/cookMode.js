export class CookMode {
    constructor() {
        this.currentRecipe = null;
        this.currentStep = 0;
        this.timerSeconds = 0;
        this.isTimerRunning = false;
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('🍳 Cook Mode initialized');
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const cookBtn = e.target.closest('.feed-post__cookmode-btn');
            if (cookBtn) {
                console.log('🍳 Cook Mode button clicked');
                const post = cookBtn.closest('.feed-post');
                if (post) {
                    this.openFromPost(post);
                }
            }

            // THÊM: Xử lý click từ recipe detail
            const recipeCookBtn = e.target.closest('#cookModeBtn');
            if (recipeCookBtn) {
                console.log('🍳 Cook Mode button clicked from recipe detail');
                // Sẽ được xử lý bởi recipe-detail.js
            }
        });

        this.bindModalEvents();
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    bindModalEvents() {
        const modal = document.getElementById('cookModeModal');
        if (!modal) {
            console.error('❌ Cook Mode modal not found');
            return;
        }
        
        console.log('✅ Cook Mode modal found');
        
        modal.querySelector('.cookmode__close').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        
        // Step navigation
        modal.querySelector('[data-cm-prev]').addEventListener('click', () => this.prevStep());
        modal.querySelector('[data-cm-next]').addEventListener('click', () => this.nextStep());
        modal.querySelector('[data-cm-finish]').addEventListener('click', () => this.finish());
        
        // Timer controls
        modal.querySelector('[data-cm-startstop]').addEventListener('click', () => this.toggleTimer());
        modal.querySelector('[data-cm-plus]').addEventListener('click', () => this.adjustTimer(60));
        modal.querySelector('[data-cm-minus]').addEventListener('click', () => this.adjustTimer(-60));
    }

    // THÊM METHOD BỊ THIẾU
    openFromRecipeDetail(recipeData) {
        console.log('🍳 Opening Cook Mode from recipe detail', recipeData);
        
        if (!recipeData) {
            alert('❌ Không thể tải công thức.');
            return;
        }

        if (recipeData.steps.length === 0) {
            alert('⚠️ Công thức này không có bước thực hiện.');
            return;
        }

        this.currentRecipe = recipeData;
        this.currentStep = 0;
        this.timerSeconds = 0;
        
        this.render();
        this.showModal();
    }

    extractRecipeData(postEl) {
        try {
            console.log('🔍 Extracting recipe data from post');
            
            const titleElement = postEl.querySelector('.feed-post__recipe-title');
            const title = titleElement ? titleElement.textContent.replace('🍴', '').trim() : 'Công thức nấu ăn';
            
            const ingredients = [];
            const ingredientElements = postEl.querySelectorAll('.feed-post__ingredients-list li');
            ingredientElements.forEach(li => {
                if (li.textContent.trim()) {
                    ingredients.push(li.textContent.trim());
                }
            });
            
            const steps = [];
            const stepElements = postEl.querySelectorAll('.feed-post__steps-list li');
            stepElements.forEach(li => {
                if (li.textContent.trim()) {
                    steps.push(li.textContent.trim());
                }
            });
            
            const metaElements = postEl.querySelectorAll('.feed-post__recipe-info-item');
            const meta = {
                prep: metaElements[0]?.textContent?.replace('⏱️ Chuẩn bị: ', '').trim() || '--',
                cook: metaElements[1]?.textContent?.replace('🔥 Nấu: ', '').trim() || '--',
                servings: metaElements[2]?.textContent?.replace('👥 Khẩu phần: ', '').trim() || '--',
                difficulty: metaElements[3]?.textContent?.replace('📊 Độ khó: ', '').trim() || '--'
            };

            const tipsElement = postEl.querySelector('.feed-post__recipe-tips span');
            const tips = tipsElement ? tipsElement.textContent.trim() : '';

            console.log('📋 Recipe data extracted:', {
                title,
                ingredients: ingredients.length,
                steps: steps.length,
                meta,
                hasTips: !!tips
            });

            return { title, ingredients, steps, meta, tips };
        } catch (error) {
            console.error('❌ Error extracting recipe data:', error);
            return null;
        }
    }

    openFromPost(postEl) {
        console.log('🍳 Opening Cook Mode from post');
        const recipeData = this.extractRecipeData(postEl);
        
        if (!recipeData) {
            alert('❌ Không thể tải công thức từ bài đăng này.');
            return;
        }

        if (recipeData.steps.length === 0) {
            alert('⚠️ Công thức này không có bước thực hiện.');
            return;
        }

        this.currentRecipe = recipeData;
        this.currentStep = 0;
        this.timerSeconds = 0;
        
        this.render();
        this.showModal();
    }

    render() {
        if (!this.currentRecipe) return;

        const { title, ingredients, steps, meta, tips } = this.currentRecipe;

        console.log('🎨 Rendering Cook Mode with:', { title, steps: steps.length });

        // Update basic info
        document.querySelector('.cookmode__dish-name').textContent = title;
        document.querySelector('[data-cm-prep]').textContent = meta.prep;
        document.querySelector('[data-cm-cook]').textContent = meta.cook;
        document.querySelector('[data-cm-serv]').textContent = meta.servings;
        document.querySelector('[data-cm-diff]').textContent = meta.difficulty;

        // Render ingredients
        const ingredientsList = document.querySelector('.cookmode__ingredients');
        ingredientsList.innerHTML = ingredients.map((ingredient, index) => `
            <li>
                <input type="checkbox" id="ing-${index}">
                <label for="ing-${index}">${ingredient}</label>
            </li>
        `).join('');

        // Render tips
        const tipElement = document.querySelector('[data-cm-tip]');
        if (tips && tips.trim()) {
            tipElement.style.display = 'block';
            tipElement.querySelector('.cookmode__tip-text').textContent = tips;
        } else {
            tipElement.style.display = 'none';
        }

        // Update steps
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        if (!this.currentRecipe) return;

        const { steps } = this.currentRecipe;
        const totalSteps = steps.length;

        console.log('🔄 Updating step display:', { current: this.currentStep, total: totalSteps });

        document.querySelector('[data-cm-step-index]').textContent = this.currentStep + 1;
        document.querySelector('[data-cm-step-total]').textContent = totalSteps;
        document.querySelector('[data-cm-step-text]').textContent = steps[this.currentStep] || 'Không có mô tả bước';

        // Update progress
        const progress = ((this.currentStep + 1) / totalSteps) * 100;
        document.querySelector('[data-cm-progress]').textContent = Math.round(progress) + '%';
        document.querySelector('[data-cm-progress-bar]').style.width = progress + '%';

        // Update button states
        const prevBtn = document.querySelector('[data-cm-prev]');
        const nextBtn = document.querySelector('[data-cm-next]');
        const finishBtn = document.querySelector('[data-cm-finish]');

        prevBtn.disabled = this.currentStep === 0;
        nextBtn.style.display = this.currentStep < totalSteps - 1 ? 'flex' : 'none';
        finishBtn.style.display = this.currentStep === totalSteps - 1 ? 'flex' : 'none';

        // Auto-detect and set timer from step text
        this.autoSetTimer(steps[this.currentStep]);
    }

    autoSetTimer(stepText) {
        if (!stepText) return;

        const timeMatches = stepText.match(/(\d+)\s*(phút|ph|phút|min|minutes?)/i);
        if (timeMatches) {
            const minutes = parseInt(timeMatches[1]);
            this.timerSeconds = minutes * 60;
            this.updateTimerDisplay();
            console.log('⏰ Auto-set timer to', minutes, 'minutes');
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        document.querySelector('[data-cm-timer]').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    toggleTimer() {
        if (this.isTimerRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.timerSeconds <= 0) {
            alert('⏰ Vui lòng đặt thời gian trước khi bắt đầu!');
            return;
        }

        this.isTimerRunning = true;
        const timerBtn = document.querySelector('[data-cm-startstop]');
        timerBtn.textContent = 'Dừng';
        timerBtn.classList.add('timer-active');

        console.log('⏰ Timer started:', this.timerSeconds, 'seconds');

        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();

            if (this.timerSeconds <= 0) {
                this.stopTimer();
                this.showTimerComplete();
            }
        }, 1000);
    }

    stopTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        
        const timerBtn = document.querySelector('[data-cm-startstop]');
        timerBtn.textContent = 'Bắt đầu';
        timerBtn.classList.remove('timer-active');

        console.log('⏰ Timer stopped');
    }

    adjustTimer(seconds) {
        this.timerSeconds = Math.max(0, this.timerSeconds + seconds);
        this.updateTimerDisplay();
        console.log('⏰ Timer adjusted to:', this.timerSeconds, 'seconds');
    }

    showTimerComplete() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF6967, #ff8e8e);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            z-index: 4000;
            font-weight: 600;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-bell" style="font-size: 20px;"></i>
                <span>⏰ Hết giờ! Đã hoàn thành bước này!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);

        this.playBeep();
    }

    playBeep() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('🔇 Audio not supported');
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateStepDisplay();
            console.log('⬅ Moved to previous step:', this.currentStep);
        }
    }

    nextStep() {
        if (this.currentRecipe && this.currentStep < this.currentRecipe.steps.length - 1) {
            this.currentStep++;
            this.updateStepDisplay();
            console.log('➡ Moved to next step:', this.currentStep);
        }
    }

    finish() {
        this.showCompletionMessage();
        this.close();
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 4000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        message.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
            <h3 style="margin: 0 0 16px 0; color: #FF6967; font-size: 24px;">Chúc mừng!</h3>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                Bạn đã hoàn thành món <strong>${this.currentRecipe.title}</strong> một cách xuất sắc!
            </p>
            <button class="cookmode__btn cookmode__btn--primary" onclick="this.parentElement.remove();" style="margin: 0 auto;">
                Hoàn tất
            </button>
        `;
        
        document.body.appendChild(message);
    }

    showModal() {
        const modal = document.getElementById('cookModeModal');
        if (!modal) {
            console.error('❌ Cook Mode modal not found');
            return;
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('✅ Cook Mode modal opened');
    }

    close() {
        const modal = document.getElementById('cookModeModal');
        if (!modal) return;
        
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        this.stopTimer();
        this.currentRecipe = null;
        this.currentStep = 0;
        console.log('❌ Cook Mode closed');
    }

    handleKeyboard(e) {
        const modal = document.getElementById('cookModeModal');
        if (!modal || !modal.classList.contains('open')) return;

        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                if (!e.ctrlKey) this.prevStep();
                break;
            case 'ArrowRight':
                if (!e.ctrlKey) this.nextStep();
                break;
            case ' ':
                if (document.activeElement.tagName !== 'INPUT') {
                    e.preventDefault();
                    this.toggleTimer();
                }
                break;
        }
    }
}