import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Rolls vertically through `words` in one continuous power3.inOut motion
// whenever the row scrolls into view; replays every time it re-enters.
// The last word should duplicate the first so the loop lands seamlessly.
export default function WordRoller({ words, className = '', itemClassName = '', style = {}, lineHeight = '1.15em', stepDuration = 1.15 }) {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        if (!wrap || !track) return;

        // yPercent is relative to the TRACK's own height (all words stacked),
        // not one word's height — so it must be measured in px per item,
        // not assumed as a flat -100% step.
        const itemHeight = track.children[0]?.getBoundingClientRect().height || 0;
        if (!itemHeight) return;

        const tl = gsap.timeline({ paused: true });
        for (let i = 1; i < words.length; i++) {
            tl.to(track, { y: -itemHeight * i, duration: stepDuration, ease: 'power3.inOut' });
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    gsap.set(track, { y: 0 });
                    tl.restart();
                }
            },
            { threshold: 0.5 },
        );
        io.observe(wrap);
        return () => {
            io.disconnect();
            tl.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [words, stepDuration]);

    return (
        <span
            ref={wrapRef}
            className={`relative inline-block overflow-hidden align-bottom ${className}`}
            style={{ height: lineHeight, ...style }}
        >
            <span ref={trackRef} className="block">
                {words.map((w, i) => (
                    <span key={i} className={`block ${itemClassName}`} style={{ height: lineHeight, lineHeight }}>
                        {w}
                    </span>
                ))}
            </span>
        </span>
    );
}
