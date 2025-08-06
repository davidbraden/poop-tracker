const calendarWrapper = document.getElementById('calendar-wrapper');
const monthYearHeader = document.getElementById('month-year-header');
const calendarGrid = document.getElementById('calendar-grid');
const dayDetailsContainer = document.getElementById('day-details');
const dayDetailsHeader = document.getElementById('day-details-header');
const dayDetailsList = document.getElementById('day-details-list');

/**
 * Toggles the visibility of the calendar.
 * @param {boolean} show - True to show the calendar, false to hide it.
 */
export function toggleCalendar(show) {
    calendarWrapper.style.display = show ? 'block' : 'none';
}

/**
 * Renders the calendar for a specific month and year.
 * @param {Date} date - A date object representing the current month to display.
 * @param {Array<Object>} logs - All log entries.
 */
export function renderCalendar(date, logs) {
    calendarGrid.innerHTML = '';

    monthYearHeader.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const logsByDay = logs.reduce((acc, log) => {
        const dayKey = new Date(log.timestamp).toDateString();
        if (!acc[dayKey]) {
            acc[dayKey] = [];
        }
        acc[dayKey].push(log);
        return acc;
    }, {});

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const weekdayCell = document.createElement('div');
        weekdayCell.className = 'calendar-day weekday-header';
        weekdayCell.textContent = day;
        calendarGrid.appendChild(weekdayCell);
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        const currentDate = new Date(year, month, day);
        const today = new Date();

        if (currentDate.toDateString() === today.toDateString()) {
            dayCell.classList.add('is-today');
        }

        const dayKey = currentDate.toDateString();
        if (logsByDay[dayKey]) {
            dayCell.classList.add('has-logs');
            dayCell.dataset.date = currentDate.toISOString();

            const countBadge = document.createElement('span');
            countBadge.className = 'log-count';
            countBadge.textContent = logsByDay[dayKey].length;
            dayCell.appendChild(countBadge);
        }

        calendarGrid.appendChild(dayCell);
    }
}

/**
 * Renders the details for a specific day.
 * @param {Date} date - The selected date.
 * @param {Array<Object>} logsForDay - The logs for that specific day.
 */
export function renderDayDetails(date, logsForDay) {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayDetailsHeader.textContent = "Today's Logs";
    } else {
        dayDetailsHeader.textContent = `Details for ${date.toLocaleDateString()}`;
    }

    dayDetailsList.innerHTML = '';

    if (logsForDay.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No movements logged for this day.';
        dayDetailsList.appendChild(emptyMessage);
        return;
    }

    logsForDay.forEach(log => {
        const listItem = document.createElement('li');
        listItem.className = 'log-entry';

        const timestamp = new Date(log.timestamp);
        const timeText = document.createElement('span');
        timeText.textContent = timestamp.toLocaleTimeString();

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.dataset.logId = log.id;

        listItem.appendChild(timeText);
        listItem.appendChild(deleteButton);
        dayDetailsList.appendChild(listItem);
    });

    dayDetailsContainer.style.display = 'block';
}