import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Fades/rises every [data-reveal] element into view once, mirroring the
// original design's IntersectionObserver reveal but driven by GSAP.
export function useScrollReveal(scopeRef) {
    useEffect(() => {
        const root = scopeRef?.current || document;
        const els = root.querySelectorAll('[data-reveal]');
        const ctx = gsap.context(() => {
            els.forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 28 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            once: true,
                        },
                    },
                );
            });
        }, root === document ? undefined : root);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
