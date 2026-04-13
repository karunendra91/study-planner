// Study Planner App - Main Application Logic

class StudyPlannerApp {
    constructor() {
        this.checkAuthentication();
        this.loadCurrentUser();
        this.initializeDOM();
        this.loadData();
        this.setupEventListeners();
    }

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        const currentUser = JSON.parse(localStorage.getItem('studyPlannerCurrentUser')) || null;
        
        // If not logged in, redirect to signup page
        if (!currentUser) {
            window.location.href = 'singup.html';
            return false;
        }
        return true;
    }

    /**
     * Load current user information
     */
    loadCurrentUser() {
        const currentUser = JSON.parse(localStorage.getItem('studyPlannerCurrentUser')) || null;
        if (currentUser) {
            this.currentUser = currentUser;
            this.displayUserInfo();
        }
    }

    /**
     * Display user information in navbar
     */
    displayUserInfo() {
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser) {
            // Display first name only
            const firstName = this.currentUser.name.split(' ')[0];
            userNameElement.textContent = firstName;
        }
    }

    initializeDOM() {
        // DOM initialization if needed
    }

    loadData() {
        // Load all data from localStorage
        this.tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
        this.subjects = JSON.parse(localStorage.getItem('studySubjects')) || [];
        this.exams = JSON.parse(localStorage.getItem('studyExams')) || [];
        this.settings = JSON.parse(localStorage.getItem('studySettings')) || this.getDefaultSettings();
        this.pomodoroState = JSON.parse(localStorage.getItem('pomodoroTimer')) || this.getDefaultTimerState();
    }

    getDefaultSettings() {
        return {
            notificationsEnabled: true,
            dailyGoalHours: 8,
            theme: 'dark',
            soundEnabled: true,
            pomodoroFocusTime: 25,
            pomodoroBreakTime: 5
        };
    }

    getDefaultTimerState() {
        return {
            sessionType: 'focus',
            timeLeft: 25 * 60,
            isRunning: false,
            sessionsCompleted: 0,
            totalFocusTime: 0
        };
    }

    saveData() {
        localStorage.setItem('studyTasks', JSON.stringify(this.tasks));
        localStorage.setItem('studySubjects', JSON.stringify(this.subjects));
        localStorage.setItem('studyExams', JSON.stringify(this.exams));
        localStorage.setItem('studySettings', JSON.stringify(this.settings));
        localStorage.setItem('pomodoroTimer', JSON.stringify(this.pomodoroState));
    }

    setupEventListeners() {
        // Pomodoro Timer
        const timerStart = document.getElementById('timer-start');
        const timerReset = document.getElementById('timer-reset');

        if (timerStart) {
            timerStart.addEventListener('click', () => this.toggleTimer());
        }
        if (timerReset) {
            timerReset.addEventListener('click', () => this.resetTimer());
        }

        // Update timer display
        this.updateTimerDisplay();
        setInterval(() => this.updateTimerDisplay(), 1000);
    }

    toggleTimer() {
        this.pomodoroState.isRunning = !this.pomodoroState.isRunning;
        const btn = document.getElementById('timer-start');
        if (btn) {
            btn.textContent = this.pomodoroState.isRunning ? 'Pause' : 'Start';
        }

        if (this.pomodoroState.isRunning) {
            this.runTimer();
        }

        this.saveData();
    }

    resetTimer() {
        this.pomodoroState.isRunning = false;
        const focusTime = this.settings.pomodoroFocusTime || 25;
        this.pomodoroState.timeLeft = focusTime * 60;

        const btn = document.getElementById('timer-start');
        if (btn) {
            btn.textContent = 'Start';
        }

        this.updateTimerDisplay();
        this.saveData();
    }

    runTimer() {
        if (!this.pomodoroState.isRunning) return;

        if (this.pomodoroState.timeLeft > 0) {
            this.pomodoroState.timeLeft--;
            this.saveData();
            setTimeout(() => this.runTimer(), 1000);
        } else {
            // Timer complete
            this.handleTimerComplete();
        }
    }

    handleTimerComplete() {
        if (this.pomodoroState.sessionType === 'focus') {
            this.pomodoroState.sessionsCompleted++;
            this.pomodoroState.totalFocusTime += this.settings.pomodoroFocusTime || 25;
            const breakTime = this.settings.pomodoroBreakTime || 5;
            this.pomodoroState.timeLeft = breakTime * 60;
            this.pomodoroState.sessionType = 'break';
        } else {
            this.pomodoroState.timeLeft = (this.settings.pomodoroFocusTime || 25) * 60;
            this.pomodoroState.sessionType = 'focus';
        }

        this.pomodoroState.isRunning = false;
        this.playNotification();
        this.saveData();

        const btn = document.getElementById('timer-start');
        if (btn) {
            btn.textContent = 'Start';
        }

        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            const mins = Math.floor(this.pomodoroState.timeLeft / 60);
            const secs = this.pomodoroState.timeLeft % 60;
            display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    playNotification() {
        if (this.settings.soundEnabled) {
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
    }

    // Task Management
    addTask(task) {
        task.id = Date.now().toString();
        task.completed = false;
        this.tasks.push(task);
        this.saveData();
        return task;
    }

    updateTask(id, updates) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            Object.assign(task, updates);
            this.saveData();
        }
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveData();
    }

    // Subject Management
    addSubject(subject) {
        subject.id = Date.now().toString();
        subject.sessions = [];
        this.subjects.push(subject);
        this.saveData();
        return subject;
    }

    updateSubject(id, updates) {
        const subject = this.subjects.find(s => s.id === id);
        if (subject) {
            Object.assign(subject, updates);
            this.saveData();
        }
        return subject;
    }

    deleteSubject(id) {
        this.subjects = this.subjects.filter(s => s.id !== id);
        this.saveData();
    }

    addStudySession(subjectId, session) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (subject) {
            session.id = Date.now().toString();
            subject.sessions.push(session);
            subject.hoursLogged = (subject.hoursLogged || 0) + session.hours;
            this.saveData();
        }
    }

    // Exam Management
    addExam(exam) {
        exam.id = Date.now().toString();
        this.exams.push(exam);
        this.saveData();
        return exam;
    }

    updateExam(id, updates) {
        const exam = this.exams.find(e => e.id === id);
        if (exam) {
            Object.assign(exam, updates);
            this.saveData();
        }
        return exam;
    }

    deleteExam(id) {
        this.exams = this.exams.filter(e => e.id !== id);
        this.saveData();
    }

    // Settings Management
    updateSettings(updates) {
        Object.assign(this.settings, updates);
        this.saveData();
    }

    // Utility Methods
    getTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    getSubjectProgress(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return 0;
        return Math.min((subject.hoursLogged / subject.targetHours) * 100, 100);
    }

    getDaysUntilExam(examDate) {
        const exam = new Date(examDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        exam.setHours(0, 0, 0, 0);
        const diffTime = exam.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getTotalStudyHours() {
        return this.subjects.reduce((sum, subject) => sum + (subject.hoursLogged || 0), 0);
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.tasks = [];
            this.subjects = [];
            this.exams = [];
            this.pomodoroState = this.getDefaultTimerState();
            this.saveData();
            location.reload();
        }
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StudyPlannerApp();
});

// Format date helper
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Utility function for creating card elements
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'card bg-dark border-secondary mb-3';
    card.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''} onchange="window.app.updateTask('${task.id}', {completed: this.checked}); location.reload();">
                        <label class="form-check-label ${task.completed ? 'text-muted text-decoration-line-through' : ''}">
                            ${task.title}
                        </label>
                    </div>
                    <div class="d-flex gap-2 flex-wrap small">
                        ${task.subject ? `<span class="badge bg-primary">${task.subject}</span>` : ''}
                        ${task.priority ? `<span class="badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}">${task.priority}</span>` : ''}
                        ${task.dueDate ? `<span class="badge bg-secondary">${formatDate(task.dueDate)}</span>` : ''}
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="if(confirm('Delete this task?')) { window.app.deleteTask('${task.id}'); location.reload(); }">✕</button>
            </div>
        </div>
    `;
    return card;
}
