/**
 * The key used to store the logs in localStorage.
 */
const STORAGE_KEY = 'poop-tracker-logs';

/**
 * Retrieves all logs from localStorage.
 * @returns {Array<Object>} An array of log objects. Returns an empty array if no logs are found.
 */
export function getLogs() {
    const rawLogs = localStorage.getItem(STORAGE_KEY);
    return rawLogs ? JSON.parse(rawLogs) : [];
}

/**
 * Saves the provided array of logs to localStorage.
 * @param {Array<Object>} logs - The array of log objects to save.
 */
export function saveLogs(logs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
