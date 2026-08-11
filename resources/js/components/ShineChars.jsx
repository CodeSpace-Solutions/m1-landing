import { useRef } from 'react';
import { useWhenVisible } from '../lib/useWhenVisible';

export default function ShineChars({ text, className = '' }) {
    const ref = useRef(null);
    useWhenVisible(ref);

    return (
        <span ref={ref} className={`m3-shine-phrase ${className}`}>
            <span className="m3-shine-text">{text}</span>
            <span className="m3-shine-ray" aria-hidden>{text}</span>
        </span>
    );
}
