export default function Placeholder({ label, className = '', style = {}, ...rest }) {
    return (
        <div
            className={`flex items-center justify-center border border-dashed border-current/30 bg-current/5 text-current/50 text-center text-xs px-3 ${className}`}
            style={style}
            {...rest}
        >
            {label}
        </div>
    );
}
