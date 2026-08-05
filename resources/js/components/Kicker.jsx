import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A small uppercase section label whose gradient highlight sweeps left→right,
// scrubbed directly to scroll position (not time-based) as the label passes
// through the viewport.
export default function Kicker({ children, gradient, className = '', style = {}, ...rest }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const tween = gsap.fromTo(
            el,
            { backgroundPosition: '200% 0' },
            {
                backgroundPosition: '0% 0',
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    end: 'top 45%',
                    scrub: 0.3,
                },
            },
        );
        return () => {
            tween.scrollTrigger && tween.scrollTrigger.kill();
            tween.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span
            ref={ref}
            className={className}
            style={{
                backgroundImage: gradient,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                ...style,
            }}
            {...rest}
        >
            {children}
        </span>
    );
}
