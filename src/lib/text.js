export function countWords(text) {
    const words = String(text || "").trim().match(/\S+/g);
    return words ? words.length : 0;
}

export function formatClock(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export function timeAgo(date) {
    const secs = Math.round((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 45) return "just now";
    const mins = Math.round(secs / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/** Plain text as a Quill delta, so Berserk sessions can be saved as docs. */
export function textToDelta(text) {
    const body = String(text || "");
    return { ops: [{ insert: body.endsWith("\n") ? body : `${body}\n` }] };
}

export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
