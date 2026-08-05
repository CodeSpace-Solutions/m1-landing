import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// "No X?" morphs into "Y!" on scroll-in: a strike bar draws through the
// question while it dims, the "?" spins away, and the answer springs in
// tinted gold. Resets when scrolled back out so it can replay.
export default function MorphBadge({ question = 'No markup?', answer = 'fair!', gold = '#D19A1B', className = '' }) {
    const rootRef = useRef(null);
    const sizerRef = useRef(null);
    const beforeWordRef = useRef(null);
    const strikeRef = useRef(null);
    const qRef = useRef(null);
    const afterRef = useRef(null);
    const bangRef = useRef(null);

    const qMatch = question.match(/[?!.]+$/);
    const punct = qMatch ? qMatch[0] : '';
    const beforeWord = punct ? question.slice(0, -punct.length) : question;
    const bang = answer.endsWith('!') ? '!' : '';
    const afterWord = bang ? answer.slice(0, -1) : answer;

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const reset = () => {
            gsap.set(strikeRef.current, { scaleX: 0 });
            gsap.set(beforeWordRef.current, { opacity: 1 });
            gsap.set(qRef.current, { opacity: 1, rotate: 0, scale: 1 });
            gsap.set(afterRef.current, { opacity: 0, y: 6, color: 'inherit' });
            gsap.set(bangRef.current, { scale: 0, rotate: -25 });
        };
        reset();

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const tl = gsap.timeline();
                    tl.to(strikeRef.current, { scaleX: 1, duration: 0.45, ease: 'power2.out' })
                        .to(beforeWordRef.current, { opacity: 0.34, duration: 0.35 }, '<')
                        .to(qRef.current, { rotate: 90, scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.1')
                        .to(afterRef.current, { opacity: 1, y: 0, color: gold, duration: 0.4, ease: 'power2.out' }, '-=0.05')
                        .to(bangRef.current, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)' }, '-=0.25');
                } else {
                    reset();
                }
            },
            { threshold: 0.5 },
        );
        io.observe(el);
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question, answer]);

    return (
        <span ref={rootRef} className={`relative inline-block align-bottom ${className}`}>
            <span ref={sizerRef} className="invisible whitespace-nowrap">
                {beforeWord}
                {punct} {afterWord}
                {bang}
            </span>
            <span className="absolute inset-0 inline-flex items-center whitespace-nowrap">
                <span className="relative inline-block">
                    <span ref={beforeWordRef} className="inline-block">{beforeWord}</span>
                    <span ref={strikeRef} className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-current" style={{ transform: 'scaleX(0)' }} />
                </span>
                <span ref={qRef} className="inline-block">{punct}</span>
            </span>
            <span ref={afterRef} className="absolute inset-0 inline-flex items-center whitespace-nowrap font-extrabold" style={{ opacity: 0 }}>
                {afterWord}
                <span ref={bangRef} className="inline-block" style={{ transformOrigin: '50% 80%' }}>{bang}</span>
            </span>
        </span>
    );
}
