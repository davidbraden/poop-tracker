import { getLogs, saveLogs } from './storage.js';
import { renderCalendar, renderDayDetails, toggleCalendar } from './ui.js';

// --- STATE --- //
let logs = [];
let currentDate = new Date(); // For calendar navigation
let selectedDate = new Date(); // For detail view, defaults to today
let isCalendarVisible = false;

// --- DOM ELEMENTS --- //
const logButton = document.getElementById('log-button');
const prevMonthButton = document.getElementById('prev-month-button');
const nextMonthButton = document.getElementById('next-month-button');
const calendarGrid = document.getElementById('calendar-grid');
const dayDetailsList = document.getElementById('day-details-list');
const toggleCalendarButton = document.getElementById('toggle-calendar-button');

// --- FUNCTIONS --- //

/**
 * Renders the entire UI based on the current state.
 */
function rerenderUI() {
    renderCalendar(currentDate, logs);

    const logsForDay = logs.filter(log => new Date(log.timestamp).toDateString() === selectedDate.toDateString());
    renderDayDetails(selectedDate, logsForDay);

    toggleCalendar(isCalendarVisible);
    toggleCalendarButton.textContent = isCalendarVisible ? 'Hide Calendar' : 'Show Calendar';
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
    selectedDate = new Date(); // Switch to today's view after logging
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
    renderCalendar(currentDate, logs);
}

/**
 * Toggles the visibility of the main calendar grid.
 */
function toggleCalendarVisibility() {
    isCalendarVisible = !isCalendarVisible;
    toggleCalendar(isCalendarVisible);
    toggleCalendarButton.textContent = isCalendarVisible ? 'Hide Calendar' : 'Show Calendar';
}

/**
 * Handles clicks within the calendar grid to select a day.
 * @param {Event} event
 */
function handleCalendarClick(event) {
    const dayCell = event.target.closest('.calendar-day');
    if (dayCell && dayCell.dataset.date) {
        selectedDate = new Date(dayCell.dataset.date);
        isCalendarVisible = false; // Hide calendar after selection
        rerenderUI();
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
 * Initializes the application.
 */
function init() {
    // Set up event listeners
    logButton.addEventListener('click', addLog);
    toggleCalendarButton.addEventListener('click', toggleCalendarVisibility);
    calendarGrid.addEventListener('click', handleCalendarClick);
    dayDetailsList.addEventListener('click', handleDayDetailsClick);
    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    // Load initial data and render the initial "Today" view
    logs = getLogs();
    rerenderUI();
}

// Start the application
init();
