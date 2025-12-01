class Timer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.mode = 'countdown'; // 'countdown' or 'countup'
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('time');
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.countdownBtn = document.getElementById('countdownBtn');
        this.countupBtn = document.getElementById('countupBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.progressFill = document.getElementById('progressFill');
        this.container = document.querySelector('.container');
        this.helpBtn = document.getElementById('helpBtn');
        this.shortcutsList = document.getElementById('shortcutsList');

        // Task manager elements
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.taskFilters = document.querySelectorAll('.task-filter');
        this.taskSummary = document.getElementById('taskSummary');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');

        this.tasks = [];
        this.activeFilter = 'all';
        
        // Restrict inputs to valid ranges
        this.hoursInput.addEventListener('input', () => {
            this.hoursInput.value = Math.max(0, Math.min(23, parseInt(this.hoursInput.value) || 0));
        });
        this.minutesInput.addEventListener('input', () => {
            this.minutesInput.value = Math.max(0, Math.min(59, parseInt(this.minutesInput.value) || 0));
        });
        this.secondsInput.addEventListener('input', () => {
            this.secondsInput.value = Math.max(0, Math.min(59, parseInt(this.secondsInput.value) || 0));
        });
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.countdownBtn.addEventListener('click', () => this.setMode('countdown'));
        this.countupBtn.addEventListener('click', () => this.setMode('countup'));
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.helpBtn.addEventListener('click', () => this.toggleShortcutsHelp());

        // Task manager events
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        this.taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleAddTask();
            }
        });

        this.taskList.addEventListener('click', (e) => this.handleTaskListClick(e));

        this.taskFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.taskFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });

        if (this.clearCompletedBtn) {
            this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());
        }
        
        // Close shortcuts help when clicking outside
        document.addEventListener('click', (e) => {
            if (this.shortcutsList && this.shortcutsList.style.display !== 'none') {
                if (!this.shortcutsList.contains(e.target) && e.target !== this.helpBtn) {
                    this.shortcutsList.style.display = 'none';
                }
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in input fields
            const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                                   document.activeElement.tagName === 'TEXTAREA';
            
            // Allow Escape to always work (to exit fullscreen, even when typing)
            if (e.code === 'Escape') {
                if (document.fullscreenElement) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                return;
            }
            
            // Block ALL keyboard shortcuts when typing in any input field
            // This includes time inputs (hours, minutes, seconds) and task input
            if (isInputFocused) {
                return;
            }
            
            // Space: Start/Pause (but not when typing)
            if (e.code === 'Space' && !isInputFocused) {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            } 
            // R: Reset
            else if (e.code === 'KeyR' && !isInputFocused) {
                e.preventDefault();
                this.reset();
            } 
            // F or F11: Toggle Fullscreen (but not when typing in inputs)
            else if ((e.code === 'KeyF' || e.code === 'F11') && !isInputFocused) {
                e.preventDefault();
                this.toggleFullscreen();
            }
            // C: Switch between Countdown/Count Up mode
            else if (e.code === 'KeyC' && !isInputFocused) {
                e.preventDefault();
                const newMode = this.mode === 'countdown' ? 'countup' : 'countdown';
                this.setMode(newMode);
            }
            // ? (Shift+/) or H: Toggle help/shortcuts
            else if (((e.code === 'Slash' && e.shiftKey) || e.code === 'KeyH') && !isInputFocused) {
                e.preventDefault();
                this.toggleShortcutsHelp();
            }
        });

        // Load tasks from storage after listeners
        this.loadTasksFromStorage();
    }
    
    setMode(mode) {
        if (this.isRunning) return;
        
        this.mode = mode;
        
        if (mode === 'countdown') {
            this.countdownBtn.classList.add('active');
            this.countupBtn.classList.remove('active');
        } else {
            this.countupBtn.classList.add('active');
            this.countdownBtn.classList.remove('active');
        }
        
        this.reset();
    }
    
    start() {
        if (this.mode === 'countdown') {
            // Get time from inputs
            if (!this.isPaused) {
                const hours = parseInt(this.hoursInput.value) || 0;
                const minutes = parseInt(this.minutesInput.value) || 0;
                const seconds = parseInt(this.secondsInput.value) || 0;
                this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
                this.remainingSeconds = this.totalSeconds;
                
                if (this.totalSeconds === 0) {
                    alert('Please set a time first!');
                    return;
                }
            }
        } else {
            // Count up mode
            if (!this.isPaused) {
                this.remainingSeconds = 0;
                this.totalSeconds = 0;
            }
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        
        this.intervalId = setInterval(() => {
            if (this.mode === 'countdown') {
                this.remainingSeconds--;
                if (this.remainingSeconds <= 0) {
                    this.remainingSeconds = 0;
                    this.complete();
                }
            } else {
                this.remainingSeconds++;
            }
            this.updateDisplay();
        }, 1000);
    }
    
    pause() {
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        if (this.mode === 'countdown') {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
            this.remainingSeconds = this.totalSeconds;
        } else {
            this.remainingSeconds = 0;
            this.totalSeconds = 0;
        }
        
        this.updateDisplay();
    }
    
    complete() {
        this.pause();
        
        // Visual and audio alert
        document.body.style.animation = 'flash 0.5s ease 5';
        this.playSound();
        
        // Reset animation after it completes
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2500);
    }
    
    playSound() {
        // Create a beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    updateDisplay() {
        let displaySeconds = this.remainingSeconds;
        
        if (this.mode === 'countdown') {
            displaySeconds = this.remainingSeconds;
        } else {
            displaySeconds = this.remainingSeconds;
        }
        
        const hours = Math.floor(Math.abs(displaySeconds) / 3600);
        const minutes = Math.floor((Math.abs(displaySeconds) % 3600) / 60);
        const seconds = Math.abs(displaySeconds) % 60;
        
        this.timeDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update progress bar for countdown mode
        if (this.mode === 'countdown' && this.totalSeconds > 0) {
            const progress = ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
            this.progressFill.style.width = `${progress}%`;
        } else if (this.mode === 'countup') {
            // For countup, show a simple progress indicator
            this.progressFill.style.width = '0%';
        }
        
        // Always keep black background
        document.body.style.background = '#000000';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.container.classList.add('fullscreen');
                this.fullscreenBtn.textContent = 'Exit Fullscreen';
            }).catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                this.container.classList.remove('fullscreen');
                this.fullscreenBtn.textContent = 'Fullscreen';
            }).catch(err => {
                console.log(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    }
    
    toggleShortcutsHelp() {
        if (this.shortcutsList.style.display === 'none') {
            this.shortcutsList.style.display = 'block';
        } else {
            this.shortcutsList.style.display = 'none';
        }
    }

    // ----- Task manager methods -----
    handleAddTask() {
        const text = (this.taskInput.value || '').trim();
        if (!text) return;

        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        this.tasks.unshift(newTask);
        this.taskInput.value = '';
        this.saveTasksToStorage();
        this.renderTasks();
    }

    handleTaskListClick(e) {
        const itemEl = e.target.closest('.task-item');
        if (!itemEl) return;
        const id = itemEl.dataset.id;

        if (e.target.classList.contains('task-checkbox')) {
            this.toggleTaskCompleted(id, e.target.checked);
        } else if (e.target.classList.contains('task-delete')) {
            this.deleteTask(id);
        }
    }

    toggleTaskCompleted(id, completed) {
        this.tasks = this.tasks.map(t =>
            t.id === id ? { ...t, completed } : t
        );
        this.saveTasksToStorage();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasksToStorage();
        this.renderTasks();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasksToStorage();
        this.renderTasks();
    }

    renderTasks() {
        if (!this.taskList) return;

        let visibleTasks = this.tasks;
        if (this.activeFilter === 'active') {
            visibleTasks = this.tasks.filter(t => !t.completed);
        } else if (this.activeFilter === 'completed') {
            visibleTasks = this.tasks.filter(t => t.completed);
        }

        this.taskList.innerHTML = '';
        visibleTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;
            li.innerHTML = `
                <div class="task-main">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
                    <div class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</div>
                </div>
                <button class="task-delete" title="Delete task">✕</button>
            `;
            this.taskList.appendChild(li);
        });

        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        if (this.taskSummary) {
            if (total === 0) {
                this.taskSummary.textContent = 'No tasks';
            } else {
                this.taskSummary.textContent = `${completed}/${total} completed`;
            }
        }
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem('fullscreen-timer-tasks', JSON.stringify(this.tasks));
        } catch (e) {
            console.warn('Unable to save tasks', e);
        }
    }

    loadTasksFromStorage() {
        try {
            const raw = localStorage.getItem('fullscreen-timer-tasks');
            if (raw) {
                this.tasks = JSON.parse(raw);
            }
        } catch (e) {
            this.tasks = [];
        }
        this.renderTasks();
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
    const timer = window.timer;
    if (!document.fullscreenElement) {
        timer.container.classList.remove('fullscreen');
        timer.fullscreenBtn.textContent = 'Fullscreen';
    }
});

// Initialize timer when page loads
window.timer = new Timer();
