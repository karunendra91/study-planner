// Calendar Page JavaScript

let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('monthDisplay').textContent = `${monthNames[month]} ${year}`;

    // Get first day and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create calendar
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            cell.style.cursor = 'pointer';
            cell.style.padding = '10px';
            cell.style.textAlign = 'center';

            if ((i === 0 && j < firstDay) || date > daysInMonth) {
                cell.textContent = '';
            } else {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

                // Mock study hours
                const studyHours = (Math.random() * 8).toFixed(1);

                cell.innerHTML = `
                    <div style="padding: 8px; border-radius: 6px; ${isToday ? 'border: 2px solid #0d6efd;' : 'border: 1px solid #444;'}">
                        <div style="font-weight: bold;">${date}</div>
                        <div style="font-size: 0.8rem; color: #0d6efd;">${studyHours}h</div>
                    </div>
                `;

                cell.addEventListener('click', () => selectDate(dateStr));
                date++;
            }
            row.appendChild(cell);
        }

        calendarGrid.appendChild(row);
    }
}

function selectDate(dateStr) {
    const date = new Date(dateStr);
    document.getElementById('selectedDateDisplay').textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    // Mock data for day
    const tasksForDay = Math.floor(Math.random() * 5);
    const examsForDay = Math.random() > 0.7 ? 1 : 0;
    const studyHours = (Math.random() * 8).toFixed(1);

    document.getElementById('dayDetails').innerHTML = `
        <div class="mb-3">
            <p class="text-muted mb-1">Study Hours</p>
            <p style="font-size: 1.5rem; font-weight: bold; color: #0d6efd;">${studyHours}h</p>
        </div>
        <hr class="bg-secondary">
        <div class="space-y-3">
            <div class="d-flex justify-content-between">
                <span class="text-muted">Tasks</span>
                <span style="font-weight: bold;">${tasksForDay}</span>
            </div>
            <div class="d-flex justify-content-between">
                <span class="text-muted">Exams</span>
                <span style="font-weight: bold;">${examsForDay}</span>
            </div>
        </div>
    `;
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}
