export default function ShineChars({ text, className = '' }) {
    return (
        <span className={`m3-shine-phrase ${className}`}>
            {[...String(text)].map((ch, i) => (
                <span
                    key={`${ch}-${i}`}
                    className="m3-shine-char"
                    style={{ '--i': i }}
                >
                    <span>{ch === ' ' ? '\u00a0' : ch}</span>
                    <span className="m3-shine-ray" aria-hidden>
                        {ch === ' ' ? '\u00a0' : ch}
                    </span>
                </span>
            ))}
        </span>
    );
}
