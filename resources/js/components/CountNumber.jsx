import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Counts up from 0 to `target` as it scrolls into view, popping (scale +
// colour) into place at the same moment the count-up starts.
// `delay` (seconds) should match any CSS entrance-reveal delay on an
// ancestor — geometric visibility (what IntersectionObserver sees) is true
// well before an opacity/CSS-animated row actually fades into view, so
// without this the count finishes before anyone can see it happen.
export default function CountNumber({ target, suffix = '', prefix = '', duration = 1.4, delay = 0, className = '', style = {}, from = '#9ca3af', to }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState(`${prefix}0${suffix}`);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Observe the nearest block-level ancestor rather than this tiny
        // inline number span — a small text target sitting near a threshold
        // boundary can under-report its visible ratio; a bigger container
        // comfortably clears the threshold as soon as any of the row is on
        // screen.
        const observeEl = el.closest('div') || el;
        let fired = false;
        let delayTimer = null;
        const run = () => {
            gsap.fromTo(el, { scale: 0.7, color: from }, { scale: 1, color: to, duration: 0.6, ease: 'back.out(2.4)' });
            const obj = { v: 0 };
            gsap.to(obj, {
                v: target,
                duration,
                ease: 'power3.out',
                onUpdate: () => setDisplay(`${prefix}${Math.round(obj.v)}${suffix}`),
            });
        };
        const start = () => {
            if (fired) return;
            fired = true;
            if (delay > 0) delayTimer = setTimeout(run, delay * 1000);
            else run();
        };
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                start();
            },
            { threshold: 0.15 },
        );
        io.observe(observeEl);
        // Fail-safe: if the element is already on screen at mount (common
        // for hero stats), some browsers delay the first IO callback longer
        // than feels instant — force it after a short grace period.
        const rect = observeEl.getBoundingClientRect();
        const fallback = rect.top < window.innerHeight && rect.bottom > 0 ? setTimeout(start, 500) : null;
        return () => {
            io.disconnect();
            if (fallback) clearTimeout(fallback);
            if (delayTimer) clearTimeout(delayTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, suffix, prefix, duration, delay]);

    return (
        <span ref={ref} className={`inline-block ${className}`} style={{ transformOrigin: '0% 50%', color: from, ...style }}>
            {display}
        </span>
    );
}
