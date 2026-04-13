// Tasks Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupTaskForm();
});

function renderTasks() {
    const activeTasks = window.app.tasks.filter(t => !t.completed);
    const completedTasks = window.app.tasks.filter(t => t.completed);

    // Render active tasks
    const activeList = document.getElementById('activeTasksList');
    const activeCount = document.getElementById('activCount');

    if (activeTasks.length === 0) {
        activeList.innerHTML = `
            <div class="text-center py-4 text-muted">
                <p>No active tasks. Great job!</p>
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#taskModal">+ Add a Task</button>
            </div>
        `;
    } else {
        activeList.innerHTML = activeTasks.map(task => createTaskElement(task)).join('');
    }
    activeCount.textContent = activeTasks.length;

    // Render completed tasks
    const completedList = document.getElementById('completedTasksList');
    const completedCountEl = document.getElementById('completedCount');

    if (completedTasks.length === 0) {
        completedList.innerHTML = '<div class="text-center py-4 text-muted"><p>No completed tasks yet</p></div>';
    } else {
        completedList.innerHTML = completedTasks.map(task => createTaskElement(task)).join('');
    }
    completedCountEl.textContent = completedTasks.length;
}

function createTaskElement(task) {
    const daysOverdue = task.dueDate ? window.app.getDaysUntilExam(task.dueDate) : null;
    const isOverdue = daysOverdue !== null && daysOverdue < 0 && !task.completed;

    const priorityBadgeClass = task.priority === 'High' ? 'bg-danger' :
                               task.priority === 'Medium' ? 'bg-warning text-dark' :
                               'bg-success';

    return `
        <div class="card bg-dark border-secondary ${isOverdue ? 'border-danger' : ''}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <div class="flex-grow-1">
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}
                                   onchange="window.app.updateTask('${task.id}', {completed: this.checked}); renderTasks();">
                            <label class="form-check-label ${task.completed ? 'text-muted text-decoration-line-through' : 'fw-semibold'}" for="task-${task.id}">
                                ${task.title}
                            </label>
                        </div>
                        <div class="d-flex gap-2 flex-wrap mt-2">
                            ${task.subject ? `<span class="badge bg-primary">${task.subject}</span>` : ''}
                            ${task.priority ? `<span class="badge ${priorityBadgeClass}">${task.priority}</span>` : ''}
                            ${task.dueDate ? `<span class="badge ${isOverdue ? 'bg-danger' : 'bg-secondary'}">${formatDate(task.dueDate)}</span>` : ''}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')">✕</button>
                </div>
            </div>
        </div>
    `;
}

function setupTaskForm() {
    const form = document.getElementById('taskForm');
    const modal = document.getElementById('taskModal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = {
            title: document.getElementById('taskTitle').value,
            subject: document.getElementById('taskSubject').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            notes: document.getElementById('taskNotes').value
        };

        window.app.addTask(task);

        // Clear form
        form.reset();

        // Close modal
        bootstrap.Modal.getInstance(modal).hide();

        // Re-render
        renderTasks();
    });
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        window.app.deleteTask(id);
        renderTasks();
    }
}

// Format date helper
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
