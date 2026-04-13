// Exams Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    renderExams();
    setupExamForm();
});

function renderExams() {
    const upcomingExams = window.app.exams.filter(e => e.type === 'exam' && getDaysUntil(e.date) >= 0);
    const upcomingAssignments = window.app.exams.filter(e => e.type === 'assignment' && getDaysUntil(e.date) >= 0);

    document.getElementById('examsList').innerHTML = `
        <div>
            <h5 class="mb-3">📝 Exams</h5>
            ${upcomingExams.length === 0 ? '<p class="text-muted">No upcoming exams</p>' : upcomingExams.map(exam => createExamCard(exam)).join('')}
        </div>
    `;

    document.getElementById('assignmentsList').innerHTML = `
        <div>
            <h5 class="mb-3">✏️ Assignments</h5>
            ${upcomingAssignments.length === 0 ? '<p class="text-muted">No upcoming assignments</p>' : upcomingAssignments.map(exam => createExamCard(exam)).join('')}
        </div>
    `;
}

function createExamCard(exam) {
    const daysUntil = getDaysUntil(exam.date);
    const badgeClass = daysUntil <= 3 ? 'bg-danger' : daysUntil <= 7 ? 'bg-warning text-dark' : 'bg-primary';

    return `
        <div class="card bg-dark border-secondary mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6>${exam.title}</h6>
                    <span class="badge ${badgeClass}">in ${daysUntil} days</span>
                </div>
                <p class="text-muted small mb-2">${exam.subject}</p>
                <p class="small mb-2">📅 ${formatDate(exam.date)}${exam.time ? ` at ${exam.time}` : ''}</p>
                ${exam.notes ? `<p class="small text-muted mb-3">📝 ${exam.notes}</p>` : ''}
                <div class="d-grid gap-2 d-sm-flex">
                    <button class="btn btn-sm btn-outline-primary flex-grow-1" onclick="editExam('${exam.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteExam('${exam.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
}

function setupExamForm() {
    const form = document.getElementById('examForm');
    const modal = document.getElementById('examModal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const exam = {
            title: document.getElementById('examTitle').value,
            subject: document.getElementById('examSubject').value,
            type: document.getElementById('examType').value,
            date: document.getElementById('examDate').value,
            time: document.getElementById('examTime').value,
            notes: document.getElementById('examNotes').value,
            status: 'upcoming'
        };

        window.app.addExam(exam);
        form.reset();
        bootstrap.Modal.getInstance(modal).hide();
        renderExams();
    });
}

function deleteExam(id) {
    if (confirm('Delete this exam?')) {
        window.app.deleteExam(id);
        renderExams();
    }
}

function editExam(id) {
    alert('Edit functionality coming soon');
}

function getDaysUntil(dateStr) {
    const examDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
