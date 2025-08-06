# Technical Requirements: Poop Tracker SPA

This document outlines the technical specifications and architecture for the Poop Tracker single-page application.

### **1. Core Architecture**
*   **Application Type:** Single Page Application (SPA).
*   **Technology Stack:**
    *   **HTML:** Plain, semantic HTML5.
    *   **CSS:** Plain CSS3 for styling.
    *   **JavaScript:** Vanilla JavaScript (ES6+ modules) without any external libraries or frameworks (e.g., React, Vue, jQuery).
*   **Data Storage:** All user data will be stored exclusively on the client-side using the browser's `localStorage` API. No data will be sent to a server.

### **2. Deployment**
*   **Hosting:** The application will be deployed as a set of static files.
*   **Target Platform:** Google Cloud Storage (GCS) configured for static website hosting.

### **3. Suggestions & Best Practices**

To ensure the application is maintainable and scalable, the following practices are recommended:

*   **Modular JavaScript:** Structure the JavaScript code into ES6 modules to separate concerns. For example:
    *   `main.js`: The main entry point for the application.
    *   `storage.js`: A module to handle all interactions with `localStorage` (saving, loading, deleting entries).
    *   `ui.js`: A module responsible for all DOM manipulation (rendering the list of entries, updating the view).

*   **Clear Data Model:** Define a consistent JavaScript object structure for each entry.
    ```javascript
    {
      id: 'unique-id-string-or-timestamp',
      timestamp: 'ISO-8601-string' // e.g., 2025-08-06T12:30:00.000Z
    }
    ```

*   **State Management:** Maintain a single source of truth for the application's state (e.g., the array of all logged entries) in a variable within the main module.

*   **Declarative Rendering:** Create a central `render()` function in `ui.js`. This function should:
    1.  Take the current application state as an argument.
    2.  Clear the existing list in the DOM.
    3.  Loop through the state and generate the HTML for each entry.
    4.  Append the new HTML to the DOM.
    This approach mimics the core concept of modern frameworks and simplifies updates.

*   **Event Delegation:** For handling events on dynamically created elements (like delete buttons for each log), attach a single event listener to a static parent container. This is more efficient than adding a listener to every individual element.

*   **File Structure:**
    ```
    /
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js
        ├── ui.js
        └── storage.js
    ```
