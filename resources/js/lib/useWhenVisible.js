import { useEffect } from 'react';

/** Toggles `is-active` while the element is in (or near) the viewport. */
export function useWhenVisible(ref, { threshold = 0.12, rootMargin = '80px 0px' } = {}) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const io = new IntersectionObserver(([entry]) => {
            el.classList.toggle('is-active', entry.isIntersecting);
        }, { threshold, rootMargin });
        io.observe(el);
        return () => io.disconnect();
    }, [ref, threshold, rootMargin]);
}

/** Plays a muted looping video only while it is on screen. */
export function useInViewVideo(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.play().catch(() => {});
            } else {
                el.pause();
            }
        }, { threshold: 0.12, rootMargin: '160px 0px' });
        io.observe(el);
        return () => {
            io.disconnect();
            el.pause();
        };
    }, [ref]);
}
