/**
 * Convert decimal hours to human-readable hours and minutes.
 *
 * Examples:
 * 0.83   → "50 minutes"
 * 1.00   → "1 hour"
 * 1.50   → "1 hour 30 minutes"
 * 8.00   → "8 hours"
 * 8.25   → "8 hours 15 minutes"
 *
 * @param {number} hours - Decimal hours (e.g., 0.83)
 * @returns {string} Human-readable string
 */
export function formatHours(hours) {
    if (!hours || hours === 0) return '0 minutes';

    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    let parts = [];
    if (h > 0) {
        parts.push(`${h} hour${h > 1 ? 's' : ''}`);
    }
    if (m > 0) {
        parts.push(`${m} minute${m > 1 ? 's' : ''}`);
    }
    return parts.length > 0 ? parts.join(' ') : '0 minutes';
}

/**
 * Format decimal hours as a short numeric string (e.g., "8.25 hrs")
 * Useful for exports or compact displays.
 */
export function formatHoursShort(hours) {
    if (!hours || hours === 0) return '0 hrs';
    return `${hours.toFixed(2)} hrs`;
}
