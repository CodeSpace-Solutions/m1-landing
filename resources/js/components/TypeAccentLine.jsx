import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Types `text` out in a muted colour, then pops it (scale + colour) into its
// final accent colour once the typing finishes — combines the typing effect
// with an "enlarge and colour changed" emphasis for headline highlight words.
export default function TypeAccentLine({
    text,
    as: As = 'span',
    delay = 0,
    speed = 42,
    accent,
    from = 'currentColor',
    className = '',
    style = {},
}) {
    const ref = useRef(null);
    const dur = Math.max(text.length, 1) * speed;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const timer = setTimeout(() => {
            gsap.fromTo(
                el,
                { scale: 0.85, color: from },
                { scale: 1, color: accent, duration: 0.55, ease: 'back.out(2.6)' },
            );
        }, delay + dur + 40);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <As
            ref={ref}
            className={`m-type-line inline-block ${className}`}
            style={{
                '--m-type-steps': Math.max(text.length, 1),
                animationDuration: `${dur}ms`,
                animationDelay: `${delay}ms`,
                color: from,
                transformOrigin: '0% 50%',
                ...style,
            }}
        >
            {text}
        </As>
    );
}
