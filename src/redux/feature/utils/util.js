
export function formatMinutesToHoursMinutes(minutes) {
    if (minutes == null || isNaN(minutes)) return null;
    const d = Math.floor(minutes / 1440);
    const h = Math.floor(minutes % 1440 / 60);
    const m = Math.floor(minutes % 60);

    let result = "";

    if (d > 0) result += `${d}d `;
    if (h > 0 || d >0) result += `${h}h `;
    result += `${m}mn`;

    return result.trim();
}