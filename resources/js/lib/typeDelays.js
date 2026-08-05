// Cumulative start-delay (ms) for each line so a multi-line heading types
// line-by-line in sequence instead of all at once.
export function typeDelays(lines, speed = 42, gap = 180, start = 0) {
    let t = start;
    return lines.map((text) => {
        const delay = t;
        t += Math.max(text.length, 1) * speed + gap;
        return delay;
    });
}
