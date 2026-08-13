// resources/js/Helpers/formatDate.js
export function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString + 'T00:00:00'); // treat as local date
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
