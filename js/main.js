import { getLogs, saveLogs } from './storage.js';
import { renderCalendar, renderDayDetails, toggleCalendar } from './ui.js';

// --- STATE --- //
let logs = [];
let currentDate = new Date(); // For calendar navigation
let selectedDate = null; // Default to no day selected
let isCalendarVisible = false;

// --- DOM ELEMENTS --- //
const logButton = document.getElementById('log-button');
const prevMonthButton = document.getElementById('prev-month-button');
const nextMonthButton = document.getElementById('next-month-button');
const calendarGrid = document.getElementById('calendar-grid');
const dayDetailsList = document.getElementById('day-details-list');
const toggleCalendarButton = document.getElementById('toggle-calendar-button');
const closeCalendarButton = document.getElementById('close-calendar-button');
const backToCalendarButton = document.getElementById('back-to-calendar-button');
const dayDetailsContainer = document.getElementById('day-details');
const mainElement = document.querySelector('main');

// --- FUNCTIONS --- //

/**
 * Renders the entire UI based on the current state.
 */
function rerenderUI() {
    renderCalendar(currentDate, logs);

    const shouldShowDetails = !!selectedDate;
    const shouldShowMain = isCalendarVisible || shouldShowDetails;

    if (shouldShowDetails) {
        const logsForDay = logs.filter(log => new Date(log.timestamp).toDateString() === selectedDate.toDateString());
        renderDayDetails(selectedDate, logsForDay);
        dayDetailsContainer.style.display = 'block';
    } else {
        dayDetailsContainer.style.display = 'none';
    }

    mainElement.classList.toggle('active', shouldShowMain);
    toggleCalendar(isCalendarVisible);
    toggleCalendarButton.classList.toggle('active', isCalendarVisible);
}

/**
 * Adds a new log entry, saves it, and shows the details for today.
 */
function addLog() {
    const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    saveLogs(logs);
    rerenderUI(); // Re-render to update calendar counts if visible

    // Trigger success animation on the button
    logButton.classList.add('is-success');
    setTimeout(() => {
        logButton.classList.remove('is-success');
    }, 1000); // Duration of the animation
}

/**
 * Deletes a log entry, saves the change, and re-renders the UI.
 */
function deleteLog(logId) {
    logs = logs.filter(log => log.id !== logId);
    saveLogs(logs);
    rerenderUI();
}

/**
 * Changes the calendar to the previous or next month.
 */
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate, logs);
}

/**
 * Toggles the visibility of the main calendar.
 */
function toggleCalendarVisibility() {
    isCalendarVisible = !isCalendarVisible;
    // If we are hiding the calendar, also hide the details
    if (!isCalendarVisible) {
        selectedDate = null;
    }
    rerenderUI();
}

/**
 * Handles clicks within the calendar grid to select a day.
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
 */
function handleDayDetailsClick(event) {
    if (event.target.classList.contains('delete-button')) {
        const logId = Number(event.target.dataset.logId);
        deleteLog(logId);
    }
}

/**
 * Handles returning from the details view to the calendar grid.
 */
function handleBackToCalendar() {
    selectedDate = null;
    isCalendarVisible = true;
    rerenderUI();
}

// --- INITIALIZATION --- //

/**
 * Initializes the application.
 */
function init() {
    // Set up event listeners
    logButton.addEventListener('click', addLog);
    toggleCalendarButton.addEventListener('click', toggleCalendarVisibility);
    closeCalendarButton.addEventListener('click', toggleCalendarVisibility);
    backToCalendarButton.addEventListener('click', handleBackToCalendar);
    calendarGrid.addEventListener('click', handleCalendarClick);
    dayDetailsList.addEventListener('click', handleDayDetailsClick);
    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    // Load initial data and render the initial clean view
    logs = getLogs();
    rerenderUI();
}

// Start the application
init();