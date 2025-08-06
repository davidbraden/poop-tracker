import { getLogs, saveLogs } from './storage.js';
import { renderCalendar, renderDayDetails } from './ui.js';

// --- STATE --- //
let logs = [];
let currentDate = new Date();
let selectedDate = null; // Keep track of the selected day

// --- DOM ELEMENTS --- //
const logButton = document.getElementById('log-button');
const prevMonthButton = document.getElementById('prev-month-button');
const nextMonthButton = document.getElementById('next-month-button');
const calendarGrid = document.getElementById('calendar-grid');
const dayDetailsList = document.getElementById('day-details-list');

// --- FUNCTIONS --- //

/**
 * Re-renders the calendar and the details view to keep the UI in sync.
 */
function rerenderUI() {
    renderCalendar(currentDate, logs);
    // If a day was selected, re-render its details
    if (selectedDate) {
        const logsForDay = logs.filter(log => new Date(log.timestamp).toDateString() === selectedDate.toDateString());
        renderDayDetails(selectedDate, logsForDay);
    }
}

/**
 * Adds a new log entry, saves it, and re-renders the UI.
 */
function addLog() {
    const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    saveLogs(logs);
    rerenderUI();
}

/**
 * Deletes a log entry, saves the change, and re-renders the UI.
 * @param {number} logId - The ID of the log to delete.
 */
function deleteLog(logId) {
    logs = logs.filter(log => log.id !== logId);
    saveLogs(logs);
    rerenderUI();
}

/**
 * Changes the calendar to the previous or next month.
 * @param {number} offset - -1 for the previous month, 1 for the next month.
 */
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    selectedDate = null; // Deselect day when changing month
    renderCalendar(currentDate, logs);
}

/**
 * Handles clicks within the calendar grid to show day details.
 * @param {Event} event
 */
function handleCalendarClick(event) {
    const dayCell = event.target.closest('.has-logs');
    if (dayCell) {
        selectedDate = new Date(dayCell.dataset.date);
        const logsForDay = logs.filter(log => {
            return new Date(log.timestamp).toDateString() === selectedDate.toDateString();
        });
        renderDayDetails(selectedDate, logsForDay);
    }
}

/**
 * Handles clicks within the day details list (for deleting items).
 * @param {Event} event
 */
function handleDayDetailsClick(event) {
    if (event.target.classList.contains('delete-button')) {
        const logId = Number(event.target.dataset.logId);
        deleteLog(logId);
    }
}

// --- INITIALIZATION --- //

/**
 * Initializes the application, sets up event listeners, and renders the initial view.
 */
function init() {
    // Set up event listeners
    logButton.addEventListener('click', addLog);
    calendarGrid.addEventListener('click', handleCalendarClick);
    dayDetailsList.addEventListener('click', handleDayDetailsClick);
    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    // Load initial data and render the UI
    logs = getLogs();
    renderCalendar(currentDate, logs);
}

// Start the application
init();
