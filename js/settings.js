// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateDataUsage();
});

function loadSettings() {
    const settings = window.app.settings;

    document.getElementById('notificationsToggle').checked = settings.notificationsEnabled;
    document.getElementById('soundToggle').checked = settings.soundEnabled;
    document.getElementById('dailyGoal').value = settings.dailyGoalHours;
    document.getElementById('focusTime').value = settings.pomodoroFocusTime || 25;
    document.getElementById('breakTime').value = settings.pomodoroBreakTime || 5;
}

function saveSettings() {
    const settings = {
        notificationsEnabled: document.getElementById('notificationsToggle').checked,
        soundEnabled: document.getElementById('soundToggle').checked,
        dailyGoalHours: parseInt(document.getElementById('dailyGoal').value) || 8,
        pomodoroFocusTime: parseInt(document.getElementById('focusTime').value) || 25,
        pomodoroBreakTime: parseInt(document.getElementById('breakTime').value) || 5
    };

    window.app.updateSettings(settings);

    // Show success message
    const btn = document.getElementById('saveBtn');
    const alert = document.getElementById('successAlert');

    btn.textContent = '✓ Saved!';
    btn.disabled = true;
    alert.style.display = 'block';

    setTimeout(() => {
        btn.textContent = 'Save Settings';
        btn.disabled = false;
    }, 2000);

    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function updateDataUsage() {
    let totalSize = 0;
    const items = [
        'studyTasks',
        'studySubjects',
        'studyExams',
        'pomodoroTimer',
        'studySettings',
    ];

    items.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
            totalSize += item.length;
        }
    });

    const usage = (totalSize / 1024).toFixed(2);
    document.getElementById('dataUsage').textContent = usage;
}

function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        if (confirm('This action cannot be reversed. Are you absolutely sure?')) {
            localStorage.clear();
            alert('All data has been reset.');
            location.reload();
        }
    }
}
