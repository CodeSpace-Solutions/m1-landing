import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Scales up from a smaller size and shifts colour into place as it scrolls
// into view — an "enlarge + colour change" emphasis for stat numbers and
// other short highlight text.
export default function PopIn({
    as: As = 'span',
    from = '#9ca3af',
    to,
    className = '',
    style = {},
    children,
    threshold = 0.4,
    scaleFrom = 0.7,
    duration = 0.6,
    delay = 0,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                io.disconnect();
                gsap.fromTo(
                    el,
                    { scale: scaleFrom, color: from },
                    { scale: 1, color: to, duration, ease: 'back.out(2.4)', delay },
                );
            },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <As ref={ref} className={`inline-block ${className}`} style={{ transformOrigin: '50% 50%', color: from, ...style }}>
            {children}
        </As>
    );
}
