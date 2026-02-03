// Format seconds to HH:MM:SS
export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
        .map((v) => v.toString().padStart(2, '0'))
        .join(':');
};

// Calculate elapsed time from a timestamp to now
export const getElapsedTime = (startTimestamp) => {
    if (!startTimestamp) return 0;
    return Math.floor((Date.now() - startTimestamp) / 1000);
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
};

// Format date for display (e.g., "Feb 3, 2026")
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Check if it's a new day (for midnight reset)
export const isNewDay = (lastCheckDate) => {
    const today = getCurrentDate();
    return lastCheckDate !== today;
};

// Get milliseconds until next midnight
export const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight - now;
};
