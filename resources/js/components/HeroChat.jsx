import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Sequential customer/seller chat over a background image.
 * Customer bubbles on the right, seller on the left; stream rises continuously without hard resets.
 */
export default function HeroChat({
    src,
    alt = '',
    pairs = [],
    customerLabel = 'You',
    sellerLabel = 'M1',
    statusLabel = 'Online · usually replies in minutes',
    className = '',
    style = {},
}) {
    const script = useMemo(
        () => pairs.flatMap((p, i) => [
            { role: 'customer', text: p.q, key: `q-${i}` },
            { role: 'seller', text: p.a, key: `a-${i}` },
        ]),
        [pairs],
    );

    const [visible, setVisible] = useState([]);
    const [typing, setTyping] = useState(false);
    const stepRef = useRef(0);
    const seqRef = useRef(0);
    const timers = useRef([]);

    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };

    const later = (fn, ms) => {
        const id = setTimeout(fn, ms);
        timers.current.push(id);
        return id;
    };

    useEffect(() => {
        clearTimers();
        stepRef.current = 0;
        seqRef.current = 0;
        setVisible([]);
        setTyping(false);

        if (!script.length) return undefined;

        const MAX_VISIBLE = 5;

        const pushNext = () => {
            const i = stepRef.current % script.length;
            const msg = script[i];
            const isSeller = msg.role === 'seller';

            const reveal = () => {
                setTyping(false);
                const id = `${msg.key}-${seqRef.current++}`;
                setVisible((prev) => [...prev, { ...msg, id }].slice(-MAX_VISIBLE));
                stepRef.current += 1;

                // Pace: brief beat after seller, slightly longer after customer before typing.
                const after = isSeller ? 900 : 650;
                later(pushNext, after);
            };

            if (isSeller) {
                later(() => setTyping(true), 180);
                later(reveal, 980);
            } else {
                later(reveal, 420);
            }
        };

        later(pushNext, 500);

        return clearTimers;
    }, [script]);

    return (
        <div className={`relative overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(174,24,0,.16)] ${className}`} style={style}>
            <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(12,14,20,.18) 0%, rgba(12,14,20,.35) 45%, rgba(12,14,20,.62) 100%)',
                }}
            />

            <div className="relative z-10 flex h-full flex-col p-4 sm:p-5 md:p-6">
                <div className="relative z-20 mb-3 flex flex-shrink-0 items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,.12)] backdrop-blur-md">
                    <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#eadedb]">
                        <img src="/images/m-one-logo.png" alt="" className="h-7 w-auto" />
                    </span>
                    <div className="min-w-0">
                        <p className="m-0 text-[13.5px] font-extrabold text-[#12203a]">{sellerLabel}</p>
                        <p className="m-0 text-[11.5px] font-semibold text-[#22c05c]">{statusLabel}</p>
                    </div>
                </div>

                <div className="m2-chat-stack flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden">
                    {visible.map((m) => {
                        const isCustomer = m.role === 'customer';
                        return (
                            <div
                                key={m.id}
                                className={`m2-chat-in flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[82%] rounded-[18px] px-3.5 py-2.5 text-[13.5px] leading-snug font-semibold shadow-[0_8px_22px_rgba(0,0,0,.14)] sm:text-[14px] ${
                                        isCustomer
                                            ? 'rounded-br-md bg-[#ec3013] text-white'
                                            : 'rounded-bl-md bg-white text-[#12203a]'
                                    }`}
                                >
                                    <p className={`m-0 mb-1 text-[10.5px] font-bold tracking-[0.06em] uppercase ${isCustomer ? 'text-white/75' : 'text-[#8595ad]'}`}>
                                        {isCustomer ? customerLabel : sellerLabel}
                                    </p>
                                    {m.text}
                                </div>
                            </div>
                        );
                    })}

                    {typing && (
                        <div className="m2-chat-in flex justify-start">
                            <div className="rounded-[18px] rounded-bl-md bg-white px-4 py-3 shadow-[0_8px_22px_rgba(0,0,0,.14)]">
                                <span className="inline-flex gap-1">
                                    <i className="m2-chat-dot h-1.5 w-1.5 rounded-full bg-[#b6c2d6]" />
                                    <i className="m2-chat-dot m2-chat-dot-2 h-1.5 w-1.5 rounded-full bg-[#b6c2d6]" />
                                    <i className="m2-chat-dot m2-chat-dot-3 h-1.5 w-1.5 rounded-full bg-[#b6c2d6]" />
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
