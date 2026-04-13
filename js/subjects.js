// Subjects Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
    setupSubjectForm();
});

function renderSubjects() {
    const subjectsList = document.getElementById('subjectsList');

    if (window.app.subjects.length === 0) {
        subjectsList.innerHTML = `
            <div class="col-12 text-center py-4 text-muted">
                <p>No subjects yet. Add your first subject to get started!</p>
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#subjectModal">+ Add Subject</button>
            </div>
        `;
    } else {
        subjectsList.innerHTML = window.app.subjects.map(subject => createSubjectCard(subject)).join('');
    }
}

function createSubjectCard(subject) {
    const progress = Math.min((subject.hoursLogged / subject.targetHours) * 100, 100);
    const progressPercent = Math.round(progress);

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card bg-dark border-secondary h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div class="d-flex align-items-center gap-2">
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: ${subject.color};"></div>
                            <h5 class="card-title mb-0">${subject.name}</h5>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteSubject('${subject.id}')">✕</button>
                    </div>

                    <div class="mb-4">
                        <div class="d-flex justify-content-between small mb-2">
                            <span class="text-muted">Progress</span>
                            <span class="text-foreground fw-bold">${(subject.hoursLogged || 0).toFixed(1)}h / ${subject.targetHours}h</span>
                        </div>
                        <div class="progress" role="progressbar" style="height: 8px;">
                            <div class="progress-bar" style="width: ${progress}%; background: ${subject.color};"></div>
                        </div>
                    </div>

                    <button class="btn btn-sm btn-outline-primary w-100" onclick="showSessionModal('${subject.id}')">+ Log Session</button>

                    ${subject.sessions && subject.sessions.length > 0 ? `
                        <div class="mt-3 pt-3 border-top border-secondary">
                            <p class="small text-muted mb-2">Recent Sessions:</p>
                            <div class="space-y-2">
                                ${subject.sessions.slice(0, 3).map(session => `
                                    <div class="d-flex justify-content-between small">
                                        <span>${session.hours}h - ${formatDate(session.date)}</span>
                                        <button class="btn btn-link btn-sm text-danger p-0" onclick="deleteSession('${subject.id}', '${session.id}')">✕</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function setupSubjectForm() {
    const form = document.getElementById('subjectForm');
    const modal = document.getElementById('subjectModal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const subject = {
            name: document.getElementById('subjectName').value,
            targetHours: parseInt(document.getElementById('subjectTarget').value) || 20,
            color: document.querySelector('input[name="subjectColor"]:checked').value,
            hoursLogged: 0
        };

        window.app.addSubject(subject);

        // Clear form
        form.reset();

        // Close modal
        bootstrap.Modal.getInstance(modal).hide();

        // Re-render
        renderSubjects();
    });
}

function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        window.app.deleteSubject(id);
        renderSubjects();
    }
}

function showSessionModal(subjectId) {
    const subject = window.app.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const html = `
        <div class="modal fade" id="sessionModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Log Study Session - ${subject.name}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="sessionForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="sessionHours" class="form-label">Hours Studied</label>
                                <input type="number" class="form-control" id="sessionHours" value="1" min="0.25" step="0.25" required>
                            </div>
                            <div class="mb-3">
                                <label for="sessionNotes" class="form-label">Notes</label>
                                <textarea class="form-control" id="sessionNotes" rows="3" placeholder="What did you study?"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Log Session</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if present
    const existing = document.getElementById('sessionModal');
    if (existing) existing.remove();

    // Add new modal
    document.body.insertAdjacentHTML('beforeend', html);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('sessionModal'));
    modal.show();

    // Handle form submission
    document.getElementById('sessionForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const session = {
            date: new Date().toISOString().split('T')[0],
            hours: parseFloat(document.getElementById('sessionHours').value),
            notes: document.getElementById('sessionNotes').value
        };

        window.app.addStudySession(subjectId, session);

        // Close modal
        modal.hide();

        // Clean up
        setTimeout(() => {
            document.getElementById('sessionModal').remove();
        }, 500);

        // Re-render
        renderSubjects();
    });
}

function deleteSession(subjectId, sessionId) {
    if (confirm('Are you sure you want to delete this session?')) {
        const subject = window.app.subjects.find(s => s.id === subjectId);
        if (subject) {
            const session = subject.sessions.find(s => s.id === sessionId);
            if (session) {
                subject.hoursLogged -= session.hours;
                subject.sessions = subject.sessions.filter(s => s.id !== sessionId);
                window.app.saveData();
            }
        }
        renderSubjects();
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
