import { useLayoutEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/video/why-choose-us.mp4';
const LOGO_SRC = '/images/m-one-logo.png';

/** Scale Anton headlines so longer BM phrases match EN visual width. */
function headlineSize(text, { baseVw = 11.5, baseMax = 200, baseMin = 42, refLen = 14 } = {}) {
    const len = Math.max(String(text || '').length, 1);
    const scale = Math.min(1, refLen / len);
    const vw = +(baseVw * scale).toFixed(2);
    const max = Math.round(baseMax * scale);
    const min = Math.max(28, Math.round(baseMin * scale));
    return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

function splitLetters(el) {
    if (!el || el.dataset.split === '1') return el?.querySelectorAll('span') ?? [];
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch) => {
        const s = document.createElement('span');
        s.style.display = 'inline-block';
        s.style.whiteSpace = 'pre';
        s.textContent = ch;
        el.appendChild(s);
    });
    el.dataset.split = '1';
    return el.querySelectorAll('span');
}

export default function WhyScrollStory({
    copy,
    pinLength = 11200,
    countFrom = 10,
    showGhost = true,
}) {
    const uid = useId().replace(/:/g, '');
    const stageRef = useRef(null);
    const tlRef = useRef(null);

    const copyKey = [
        copy.hud, copy.panel, copy.scrollHint, copy.w1, copy.w2, copy.w3,
        copy.pricingSuffix, copy.pricingFirst ? '1' : '0', copy.inMalaysia, copy.logoTag, ...(copy.roller || []),
    ].join('|');

    useLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage) return undefined;

        const q = (sel) => stage.querySelector(sel);
        const qa = (sel) => stage.querySelectorAll(sel);

        const teardown = () => {
            if (tlRef.current) {
                const st = tlRef.current.scrollTrigger;
                tlRef.current.kill();
                tlRef.current = null;
                // Revert pin spacer after killing the timeline so React keeps a stable outer wrapper
                if (st) st.kill(true);
            }
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === stage) t.kill(true);
            });
        };

        teardown();

        const pin = pinLength;
        const from = Math.max(2, Math.min(99, Math.round(countFrom)));
        const digits = qa('[data-no-digit]');
        digits.forEach((d) => {
            d.textContent = String(from);
        });
        const cnt = { n: from };

        const ghostTop = q('[data-ghost-top]');
        const ghostBot = q('[data-ghost-bot]');
        if (ghostTop) ghostTop.style.display = showGhost ? '' : 'none';
        if (ghostBot) ghostBot.style.display = showGhost ? '' : 'none';

        const w1word = q('[data-w1word]');
        if (w1word) {
            delete w1word.dataset.split;
            w1word.textContent = copy.w1;
        }
        const l1 = splitLetters(w1word);
        const phaseEl = q('[data-phase]');

        const clipL1 = 'polygon(0% 0%, 66% 0%, 54% 100%, 0% 100%)';
        const clipR1 = 'polygon(66% 0%, 100% 0%, 100% 100%, 54% 100%)';

        const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
                trigger: stage,
                start: 'top top',
                end: `+=${pin}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (st) => {
                    if (!phaseEl) return;
                    const p = st.progress;
                    phaseEl.textContent = p < 0.16 ? '01' : p < 0.31 ? '02' : p < 0.46 ? '03' : p < 0.65 ? '04' : p < 0.83 ? '05' : '06';
                },
            },
        });

        tl.to(q('[data-intro-hint]'), { opacity: 0, duration: 0.5 }, 0.2)
            .to(q('[data-panel-left]'), { clipPath: clipL1, duration: 1.5 }, 0.3)
            .to(q('[data-panel-right]'), { clipPath: clipR1, duration: 1.5 }, 0.3)
            .to(q('[data-seam]'), { clipPath: clipR1, duration: 1.5 }, 0.3)
            .to(q('[data-panel-left]'), { y: '-125vh', duration: 1.8 }, 2.0)
            .to(q('[data-panel-right]'), { y: '125vh', duration: 1.8 }, 2.0)
            .to(q('[data-seam]'), { y: '125vh', opacity: 0, duration: 1.8 }, 2.0)
            .to(ghostTop, { xPercent: -24, ease: 'none', duration: 22 }, 0)
            .to(ghostBot, { xPercent: 24, ease: 'none', duration: 22 }, 0)
            .addLabel('w1', 3.6)
            .set(q('[data-w1]'), { opacity: 1 }, 'w1')
            .fromTo(l1, { yPercent: 115 }, { yPercent: 0, stagger: 0.05, duration: 1.2, ease: 'power3.out' }, 'w1')
            .to(q('[data-w1shine]'), { backgroundPosition: '-30% 0', ease: 'none', duration: 1.6 }, 'w1+=0.9')
            .to(q('[data-w1]'), { opacity: 0, y: '-8vh', scale: 0.94, duration: 0.9 }, 'w1+=2.4')
            .addLabel('w2', 6.9)
            .set(q('[data-w2]'), { opacity: 1 }, 'w2')
            .fromTo(q('[data-w2grp]'), { letterSpacing: '0.55em', opacity: 0 }, { letterSpacing: '0.02em', opacity: 1, duration: 1.0, ease: 'power2.out' }, 'w2')
            .fromTo(q('[data-w2fill]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power1.inOut' }, 'w2+=0.7')
            .fromTo(q('[data-w2level]'), { top: '100%', opacity: 0 }, { top: '0%', opacity: 1, duration: 1.5, ease: 'power1.inOut' }, 'w2+=0.7')
            .to(q('[data-w2level]'), { opacity: 0, duration: 0.3 }, 'w2+=2.2')
            .fromTo(q('[data-w2fill]'), { textShadow: '0 0 0px rgba(236,48,19,0)' }, { textShadow: '0 0 55px rgba(236,48,19,0.85)', duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.out' }, 'w2+=2.2')
            .to(q('[data-w2]'), { opacity: 0, y: '-8vh', scale: 0.94, duration: 0.9 }, 'w2+=2.5')
            .addLabel('w3', 10.2)
            .set(q('[data-w3]'), { opacity: 1 }, 'w3')
            .fromTo(q('[data-w3grp]'), { x: '120vw', skewX: -14 }, { x: 0, skewX: 0, duration: 1.1, ease: 'power4.out' }, 'w3')
            .fromTo(
                q('[data-truck]'),
                { x: '120vw' },
                {
                    x: () => {
                        const word = q('[data-w3word]');
                        return `${(stage.clientWidth + (word?.offsetWidth ?? 0)) / 2 + 6}px`;
                    },
                    ease: 'power1.in',
                    duration: 1.2,
                },
                'w3+=1.5',
            )
            .to(q('[data-w3grp]'), { x: '-170vw', skewX: 14, duration: 1.3, ease: 'power2.in' }, 'w3+=2.7')
            .to(q('[data-truck]'), { x: '-180vw', duration: 1.3, ease: 'power2.in' }, 'w3+=2.7')
            .addLabel('w4', 14.4)
            .set(q('[data-w4]'), { opacity: 1 }, 'w4')
            .fromTo(
                q('[data-w4grp]'),
                { rotationX: -90, opacity: 0, transformPerspective: 700, transformOrigin: '50% 0%' },
                { rotationX: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
                'w4',
            )
            .fromTo(q('[data-w4col]'), { yPercent: 0 }, { yPercent: -80, duration: 1.7, ease: 'power2.inOut' }, 'w4+=0.8')
            .fromTo(q('[data-w4bar]'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 'w4+=2.6')
            .to(q('[data-w4]'), { y: '110vh', rotation: 5, duration: 1.2, ease: 'power2.in' }, 'w4+=2.9')
            .addLabel('fin', 18.4)
            .to(q('[data-hud]'), { opacity: 0, duration: 1 }, 'fin+=0.6')
            .to([ghostTop, ghostBot], { opacity: 0, duration: 1.2 }, 'fin+=0.6')
            // Hold starting number fully visible before counting so NO.10 isn't skipped during fade-in
            .fromTo(q('[data-giant]'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 'fin+=0.6')
            .to(
                cnt,
                {
                    n: 1,
                    ease: 'none',
                    duration: 3.8,
                    onUpdate: () => {
                        const v = Math.max(1, Math.round(cnt.n));
                        digits.forEach((d) => {
                            if (d.textContent !== String(v)) d.textContent = String(v);
                        });
                    },
                    onComplete: () => {
                        digits.forEach((d) => {
                            d.textContent = '1';
                        });
                    },
                },
                'fin+=2.2',
            )
            .to(q('[data-giant-up]'), { yPercent: -104, duration: 1.3 }, 'fin+=6.2')
            .to(q('[data-giant-down]'), { yPercent: 104, duration: 1.3 }, 'fin+=6.2')
            .to(q('[data-giant-up]'), { x: '-120vw', skewX: 8, rotate: -3, duration: 1.7 }, 'fin+=7.7')
            .to(q('[data-giant-down]'), { x: '120vw', skewX: -8, rotate: 3, duration: 1.7 }, 'fin+=7.7')
            .to(q('[data-giant-mid]'), { scale: 8.5, duration: 3, ease: 'power2.in' }, 'fin+=9.2')
            .to(q('[data-flood]'), { opacity: 1, duration: 1.2 }, 'fin+=10.8')
            .addLabel('logo', 'fin+=12.2')
            .to(q('[data-giant-mid]'), { opacity: 0, duration: 0.6 }, 'logo')
            .set(q('[data-logo-scene]'), { autoAlpha: 1 }, 'logo')
            .fromTo(
                q('[data-logo-wrap]'),
                { scale: 0.2, rotation: -8, opacity: 0 },
                { scale: 1, rotation: 0, opacity: 1, duration: 1.6, ease: 'back.out(1.4)' },
                'logo+=0.2',
            )
            .fromTo(q('[data-ring-burst]'), { scale: 0.4, opacity: 0.95 }, { scale: 3.4, opacity: 0, duration: 1.6, ease: 'power2.out' }, 'logo+=1.0')
            .fromTo(q('[data-ring1]'), { rotation: -70, opacity: 0 }, { rotation: 30, opacity: 1, duration: 2.2 }, 'logo+=0.7')
            .fromTo(q('[data-ring2]'), { rotation: 50, opacity: 0 }, { rotation: -25, opacity: 1, duration: 2.2 }, 'logo+=0.7')
            .fromTo(q('[data-logo-shine]'), { xPercent: -120 }, { xPercent: 120, duration: 1.1, ease: 'power1.inOut' }, 'logo+=1.8')
            .fromTo(q('[data-logo-tag]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 'logo+=2.0')
            .to(q('[data-ring1]'), { rotation: 60, ease: 'none', duration: 2.4 }, 'logo+=2.9')
            .to(q('[data-ring2]'), { rotation: -50, ease: 'none', duration: 2.4 }, 'logo+=2.9');

        tl.to(q('[data-prog]'), { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
        tlRef.current = tl;
        ScrollTrigger.refresh();

        return teardown;
    }, [copyKey, copy.w1, pinLength, countFrom, showGhost]);

    const pricingPhrase = copy.pricingFirst
        ? `${copy.pricingSuffix} ${copy.roller?.[copy.roller.length - 1] || ''}`.trim()
        : `${copy.roller?.[copy.roller.length - 1] || ''} ${copy.pricingSuffix}`.trim();
    const ghostLine = `${copy.w1} — ${copy.w2} — ${copy.w3} — ${pricingPhrase} — `;
    const ghostTopText = `${ghostLine}${copy.w1} — ${copy.w2} — `;
    const ghostBotText = `${copy.w3} — ${pricingPhrase} — ${copy.w1} — ${copy.w2} — ${copy.w3} — `;

    const sizeW1 = headlineSize(copy.w1);
    const sizeW2 = headlineSize(copy.w2);
    const sizeW3 = headlineSize(copy.w3);
    const sizeW4 = headlineSize(
        copy.pricingFirst
            ? `${copy.pricingSuffix} ${copy.roller?.[copy.roller.length - 1] || ''}`
            : `${copy.roller?.[copy.roller.length - 1] || ''} ${copy.pricingSuffix}`,
        { baseVw: 10.5, baseMax: 185, baseMin: 40, refLen: 16 },
    );
    const giantFrom = Math.max(2, Math.min(99, Math.round(countFrom)));
    const giantDigits = String(giantFrom).length;
    // Bigger + wider finale type (mid, up, and bottom clones share these)
    const giantFont = giantDigits >= 2
        ? 'clamp(56px, 16vw, 220px)'
        : 'clamp(64px, 20vw, 280px)';
    const giantStrokeH = giantDigits >= 2
        ? 'clamp(56px, 16vw, 220px)'
        : 'clamp(64px, 20vw, 280px)';
    const giantTracking = giantDigits >= 2 ? '0.04em' : '0.06em';
    const giantSubFont = 'clamp(16px, 3.4vw, 48px)';
    const giantSubTracking = '0.55em';

    const rollerBlock = (
        <div style={{ position: 'relative' }}>
            <div data-w4roller style={{ overflow: 'hidden', height: '1em' }}>
                <div data-w4col style={{ textAlign: 'center', color: '#ec3013' }}>
                    {copy.roller.map((word) => (
                        <div key={word}>{word}</div>
                    ))}
                </div>
            </div>
            <div
                data-w4bar
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-0.09em',
                    height: '0.07em',
                    background: '#ec3013',
                    transform: 'scaleX(0)',
                }}
            />
        </div>
    );

    return (
        // Outer wrapper stays under #why so ScrollTrigger pin-spacer never breaks React's tree
        <div className="m3-why-scroll-root">
            <div
                ref={stageRef}
                id={`why-stage-${uid}`}
                className="m3-why-story"
                style={{
                    position: 'relative',
                    height: '100vh',
                    overflow: 'hidden',
                    background: 'radial-gradient(120% 90% at 50% 42%, #191009 0%, #0d0705 62%)',
                    fontFamily: "'Space Grotesk', sans-serif",
                }}
            >
            <video
                autoPlay
                muted
                loop
                playsInline
                src={VIDEO_SRC}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.45,
                    filter: 'saturate(0.8) contrast(1.05)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    background:
                        'radial-gradient(120% 90% at 50% 42%, rgba(13,7,5,0.35) 0%, rgba(13,7,5,0.9) 75%), linear-gradient(180deg, rgba(13,7,5,0.75), rgba(13,7,5,0.35) 40%, rgba(13,7,5,0.8))',
                    pointerEvents: 'none',
                }}
            />

            <div
                data-ghost-top
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: '1vh',
                    left: 0,
                    whiteSpace: 'nowrap',
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '24vh',
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(247,242,238,0.07)',
                    letterSpacing: '0.02em',
                    willChange: 'transform',
                }}
            >
                {ghostTopText}
            </div>
            <div
                data-ghost-bot
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: '1vh',
                    left: '-40vw',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '24vh',
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(236,48,19,0.10)',
                    letterSpacing: '0.02em',
                    willChange: 'transform',
                }}
            >
                {ghostBotText}
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
                <div data-w1 style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <div
                            data-w1word
                            style={{
                                overflow: 'hidden',
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW1,
                                lineHeight: 1.04,
                                color: '#f7f2ee',
                                whiteSpace: 'nowrap',
                            }}
                        />
                        <div
                            data-w1shine
                            aria-hidden
                            style={{
                                position: 'absolute',
                                inset: 0,
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW1,
                                lineHeight: 1.04,
                                color: 'transparent',
                                backgroundImage:
                                    'linear-gradient(100deg, rgba(247,242,238,0) 42%, #ffffff 50%, #ff8a70 53%, rgba(247,242,238,0) 61%)',
                                backgroundSize: '250% 100%',
                                backgroundPosition: '130% 0',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}
                        >
                            {copy.w1}
                        </div>
                    </div>
                </div>

                <div data-w2 style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0 }}>
                    <div data-w2grp style={{ position: 'relative', letterSpacing: '0.02em' }}>
                        <div
                            style={{
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW2,
                                lineHeight: 1.02,
                                color: 'transparent',
                                WebkitTextStroke: '2px rgba(247,242,238,0.65)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {copy.w2}
                        </div>
                        <div
                            data-w2fill
                            style={{
                                position: 'absolute',
                                inset: 0,
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW2,
                                lineHeight: 1.02,
                                color: '#ec3013',
                                whiteSpace: 'nowrap',
                                clipPath: 'inset(100% 0% 0% 0%)',
                            }}
                        >
                            {copy.w2}
                        </div>
                        <div
                            data-w2level
                            style={{
                                position: 'absolute',
                                left: '-6%',
                                right: '-6%',
                                top: '100%',
                                height: 3,
                                background: 'linear-gradient(90deg, transparent, #ff8a70, transparent)',
                                opacity: 0,
                            }}
                        />
                    </div>
                </div>

                <div data-w3 style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0 }}>
                    <div data-w3grp style={{ position: 'relative', willChange: 'transform', transform: 'translate3d(120vw,0,0)' }}>
                        <div style={{ position: 'absolute', left: '-14vw', top: '22%', width: '12vw', height: 3, background: 'linear-gradient(90deg, transparent, rgba(255,138,112,0.7))' }} />
                        <div style={{ position: 'absolute', left: '-18vw', top: '52%', width: '16vw', height: 3, background: 'linear-gradient(90deg, transparent, rgba(236,48,19,0.7))' }} />
                        <div style={{ position: 'absolute', left: '-11vw', top: '80%', width: '9vw', height: 3, background: 'linear-gradient(90deg, transparent, rgba(247,242,238,0.5))' }} />
                        <div
                            data-w3word
                            style={{
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW3,
                                lineHeight: 1,
                                color: '#f7f2ee',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {copy.w3}
                        </div>
                    </div>
                </div>

                <div data-w4 style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0 }}>
                    <div data-w4grp style={{ position: 'relative', opacity: 0, willChange: 'transform' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.25em',
                                fontFamily: "'Anton', sans-serif",
                                fontSize: sizeW4,
                                lineHeight: 1,
                                color: '#f7f2ee',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {copy.pricingFirst ? (
                                <>
                                    <div>{copy.pricingSuffix}</div>
                                    {rollerBlock}
                                </>
                            ) : (
                                <>
                                    {rollerBlock}
                                    <div>{copy.pricingSuffix}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    data-truck
                    style={{
                        position: 'absolute',
                        zIndex: 4,
                        top: '50%',
                        left: 0,
                        width: 250,
                        height: 112,
                        marginTop: -66,
                        willChange: 'transform',
                        transform: 'translate3d(120vw,0,0)',
                    }}
                >
                    <div style={{ position: 'absolute', left: 74, top: 8, width: 176, height: 66, background: '#ec3013', borderRadius: 6 }} />
                    <div style={{ position: 'absolute', left: 0, top: 26, width: 66, height: 48, background: '#f7f2ee', borderRadius: '10px 6px 4px 4px' }} />
                    <div style={{ position: 'absolute', left: 8, top: 34, width: 22, height: 16, background: '#0d0705', borderRadius: 3 }} />
                    <div style={{ position: 'absolute', left: 14, top: 78, width: 34, height: 34, background: '#0d0705', border: '6px solid #f7f2ee', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', left: 170, top: 78, width: 34, height: 34, background: '#0d0705', border: '6px solid #f7f2ee', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', right: '-10vw', top: 30, width: '9vw', height: 3, background: 'linear-gradient(270deg, transparent, rgba(255,138,112,0.7))' }} />
                    <div style={{ position: 'absolute', right: '-13vw', top: 58, width: '12vw', height: 3, background: 'linear-gradient(270deg, transparent, rgba(236,48,19,0.7))' }} />
                </div>
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 4, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
                <div data-giant style={{ position: 'relative', opacity: 0, transform: 'scale(0.6)' }}>
                    <div
                        data-giant-up
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: giantStrokeH,
                            display: 'grid',
                            placeItems: 'center',
                            fontFamily: "'Anton', sans-serif",
                            fontSize: giantFont,
                            letterSpacing: giantTracking,
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '2.5px rgba(247,242,238,0.85)',
                            whiteSpace: 'nowrap',
                            willChange: 'transform',
                        }}
                    >
                        <span style={{ whiteSpace: 'nowrap', letterSpacing: giantTracking }}>
                            NO. <span data-no-digit>{giantFrom}</span>
                        </span>
                    </div>
                    <div
                        data-giant-down
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: giantStrokeH,
                            display: 'grid',
                            placeItems: 'center',
                            fontFamily: "'Anton', sans-serif",
                            fontSize: giantFont,
                            letterSpacing: giantTracking,
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '2.5px rgba(236,48,19,0.9)',
                            whiteSpace: 'nowrap',
                            willChange: 'transform',
                        }}
                    >
                        <span style={{ whiteSpace: 'nowrap', letterSpacing: giantTracking }}>
                            NO. <span data-no-digit>{giantFrom}</span>
                        </span>
                    </div>
                    <div data-giant-mid style={{ position: 'relative', textAlign: 'center', willChange: 'transform' }}>
                        <div
                            style={{
                                fontFamily: "'Anton', sans-serif",
                                fontSize: giantFont,
                                letterSpacing: giantTracking,
                                lineHeight: 1,
                                color: '#ec3013',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            NO. <span data-no-digit>{giantFrom}</span>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: giantSubFont,
                                fontWeight: 700,
                                letterSpacing: giantSubTracking,
                                color: '#f7f2ee',
                                whiteSpace: 'nowrap',
                                marginTop: '1.4vw',
                                paddingLeft: giantSubTracking,
                            }}
                        >
                            {copy.inMalaysia}
                        </div>
                    </div>
                </div>
            </div>

            <div
                data-flood
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 5,
                    background: 'linear-gradient(160deg, #dd2b0f 0%, #ae1800 100%)',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            />

            <div data-logo-scene style={{ position: 'absolute', inset: 0, zIndex: 7, opacity: 0, visibility: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                        <div
                            data-ring1
                            style={{
                                position: 'absolute',
                                width: '70vmin',
                                height: '70vmin',
                                border: '2px solid rgba(247,242,238,0.55)',
                                borderRadius: '50%',
                                borderTopColor: 'transparent',
                                borderBottomColor: 'transparent',
                            }}
                        />
                        <div
                            data-ring2
                            style={{
                                position: 'absolute',
                                width: '82vmin',
                                height: '82vmin',
                                border: '1px dashed rgba(247,242,238,0.35)',
                                borderRadius: '50%',
                            }}
                        />
                        <div
                            data-ring-burst
                            style={{
                                position: 'absolute',
                                width: '44vmin',
                                height: '24vmin',
                                border: '4px solid rgba(247,242,238,0.9)',
                                borderRadius: '50%',
                                opacity: 0,
                            }}
                        />
                        <div data-logo-wrap style={{ position: 'relative', display: 'grid', placeItems: 'center', willChange: 'transform' }}>
                            <div
                                style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: '#f7f2ee',
                                    borderRadius: 18,
                                    boxShadow: '0 12px 40px rgba(13,7,5,0.35), 0 40px 120px rgba(13,7,5,0.45)',
                                    width: '52vmin',
                                    height: '20vmin',
                                    display: 'grid',
                                    placeItems: 'center',
                                    padding: '2vmin 4vmin',
                                }}
                            >
                                <img src={LOGO_SRC} alt="M One Material" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                <div
                                    data-logo-shine
                                    style={{
                                        position: 'absolute',
                                        inset: '-20%',
                                        background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.75) 50%, transparent 58%)',
                                        transform: 'translateX(-120%)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            data-logo-tag
                            style={{
                                position: 'absolute',
                                top: 'calc(50% + 17vmin)',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 14,
                                fontWeight: 700,
                                letterSpacing: '0.5em',
                                color: 'rgba(247,242,238,0.9)',
                                whiteSpace: 'nowrap',
                                opacity: 0,
                            }}
                        >
                            {copy.logoTag}
                        </div>
                    </div>
                </div>
            </div>

            <div data-hud style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
                <div
                    className="m3-why-kicker"
                    style={{
                        position: 'absolute',
                        top: 28,
                        left: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.38em',
                        backgroundImage: 'linear-gradient(90deg, #ec3013 0%, #ec3013 42%, #ff8a70 50%, #ec3013 58%, #ec3013 100%)',
                        backgroundSize: '300% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {copy.hud}
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 24,
                        left: 32,
                        display: 'flex',
                        gap: 8,
                        alignItems: 'baseline',
                        fontSize: 12,
                        letterSpacing: '0.2em',
                        color: 'rgba(247,242,238,0.85)',
                    }}
                >
                    <span data-phase style={{ color: '#ec3013', fontWeight: 700 }}>
                        01
                    </span>
                    <span style={{ color: 'rgba(247,242,238,0.4)' }}>/ 06</span>
                </div>
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }}>
                <div
                    data-seam
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, #ff8a70, #ec3013)',
                        clipPath: 'polygon(46% 0%, 100% 0%, 100% 100%, 34% 100%)',
                        transform: 'translate3d(-7px,0,0)',
                    }}
                />
                <div
                    data-panel-right
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#0d0705',
                        willChange: 'transform',
                        clipPath: 'polygon(46% 0%, 100% 0%, 100% 100%, 34% 100%)',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'grid',
                            placeItems: 'center',
                            fontFamily: "'Anton', sans-serif",
                            fontSize: '8.5vw',
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '2px #ec3013',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {copy.panel}
                    </div>
                </div>
                <div
                    data-panel-left
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#150c07',
                        willChange: 'transform',
                        clipPath: 'polygon(0% 0%, 46% 0%, 34% 100%, 0% 100%)',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'grid',
                            placeItems: 'center',
                            fontFamily: "'Anton', sans-serif",
                            fontSize: '8.5vw',
                            lineHeight: 1,
                            color: '#f7f2ee',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {copy.panel}
                    </div>
                </div>
                <div
                    data-intro-hint
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 26,
                        textAlign: 'center',
                        fontSize: 11,
                        letterSpacing: '0.3em',
                        color: 'rgba(247,242,238,0.6)',
                    }}
                >
                    {copy.scrollHint}
                </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, zIndex: 10, background: 'rgba(247,242,238,0.08)' }}>
                <div
                    data-prog
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #ec3013, #ff8a70)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left center',
                    }}
                />
            </div>
            </div>
        </div>
    );
}
