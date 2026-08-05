// Reveals `text` with a character-stepped clip-path "typing" animation.
export default function TypeText({ text, as: As = 'span', delay = 0, speed = 42, className = '', style = {} }) {
    const dur = Math.max(text.length, 1) * speed;
    return (
        <As
            className={`m-type-line ${className}`}
            style={{
                '--m-type-steps': Math.max(text.length, 1),
                animationDuration: `${dur}ms`,
                animationDelay: `${delay}ms`,
                ...style,
            }}
        >
            {text}
        </As>
    );
}
