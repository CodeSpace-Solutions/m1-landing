<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>M1 — Move with clarity</title>
    <meta name="description" content="M1 helps teams plan routes, track operations, and deliver with confidence.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --ink: #0f1c18;
            --moss: #1a3d32;
            --leaf: #2f6b54;
            --mint: #c8e6d8;
            --sand: #e8efe9;
            --fog: #f3f7f4;
            --white: #ffffff;
            --accent: #e8ff47;
            --muted: #5a6f66;
            --font-display: "Syne", sans-serif;
            --font-body: "Manrope", sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
            font-family: var(--font-body);
            color: var(--ink);
            background: var(--fog);
            line-height: 1.5;
            overflow-x: hidden;
        }

        a { color: inherit; text-decoration: none; }

        /* —— Header —— */
        .site-header {
            position: absolute;
            inset: 0 0 auto;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem clamp(1.25rem, 4vw, 3rem);
        }

        .logo {
            font-family: var(--font-display);
            font-weight: 800;
            font-size: 1.35rem;
            letter-spacing: -0.04em;
            color: var(--white);
        }

        .nav-cta {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--ink);
            background: var(--accent);
            padding: 0.65rem 1.15rem;
            border: none;
            cursor: pointer;
            transition: transform 0.25s ease, background 0.25s ease;
        }

        .nav-cta:hover { transform: translateY(-1px); background: #f3ff7a; }

        /* —— Hero —— */
        .hero {
            position: relative;
            min-height: 100vh;
            min-height: 100dvh;
            display: grid;
            align-items: end;
            color: var(--white);
            overflow: hidden;
        }

        .hero-media {
            position: absolute;
            inset: 0;
            z-index: 0;
        }

        .hero-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 35%;
            transform: scale(1.06);
            animation: heroZoom 18s ease-out forwards;
        }

        .hero-media::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
                linear-gradient(180deg, rgba(15, 28, 24, 0.35) 0%, rgba(15, 28, 24, 0.15) 40%, rgba(15, 28, 24, 0.82) 100%),
                linear-gradient(90deg, rgba(26, 61, 50, 0.45) 0%, transparent 55%);
        }

        .hero-grain {
            position: absolute;
            inset: 0;
            z-index: 1;
            opacity: 0.12;
            pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .hero-content {
            position: relative;
            z-index: 2;
            width: min(1100px, 100%);
            padding: 0 clamp(1.25rem, 4vw, 3rem) clamp(3rem, 8vh, 5.5rem);
            display: grid;
            gap: 1.25rem;
        }

        .brand-mark {
            font-family: var(--font-display);
            font-weight: 800;
            font-size: clamp(4.5rem, 16vw, 9.5rem);
            line-height: 0.85;
            letter-spacing: -0.06em;
            opacity: 0;
            animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }

        .hero h1 {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: clamp(1.6rem, 3.8vw, 2.65rem);
            line-height: 1.15;
            letter-spacing: -0.03em;
            max-width: 16ch;
            opacity: 0;
            animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s forwards;
        }

        .hero-lead {
            font-size: clamp(1rem, 1.6vw, 1.15rem);
            font-weight: 400;
            color: rgba(255, 255, 255, 0.82);
            max-width: 36ch;
            opacity: 0;
            animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.42s forwards;
        }

        .cta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 0.5rem;
            opacity: 0;
            animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.55s forwards;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-body);
            font-size: 0.9375rem;
            font-weight: 600;
            padding: 0.9rem 1.4rem;
            border: none;
            cursor: pointer;
            transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .btn:hover { transform: translateY(-2px); }

        .btn-primary {
            background: var(--accent);
            color: var(--ink);
        }

        .btn-primary:hover { background: #f3ff7a; }

        .btn-ghost {
            background: transparent;
            color: var(--white);
            border: 1px solid rgba(255, 255, 255, 0.45);
        }

        .btn-ghost:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.75);
        }

        /* —— Purpose —— */
        .purpose {
            padding: clamp(4rem, 10vh, 7rem) clamp(1.25rem, 4vw, 3rem);
            background:
                radial-gradient(ellipse 80% 60% at 100% 0%, var(--mint) 0%, transparent 55%),
                linear-gradient(180deg, var(--fog) 0%, var(--sand) 100%);
        }

        .purpose-inner {
            width: min(900px, 100%);
            margin: 0 auto;
            display: grid;
            gap: 1rem;
        }

        .purpose h2 {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: clamp(1.75rem, 4vw, 2.75rem);
            letter-spacing: -0.035em;
            line-height: 1.15;
            max-width: 18ch;
        }

        .purpose p {
            color: var(--muted);
            font-size: 1.0625rem;
            max-width: 42ch;
        }

        /* —— Closing —— */
        .closing {
            position: relative;
            padding: clamp(4.5rem, 12vh, 8rem) clamp(1.25rem, 4vw, 3rem);
            background: var(--moss);
            color: var(--white);
            overflow: hidden;
        }

        .closing::before {
            content: "";
            position: absolute;
            width: 50vmax;
            height: 50vmax;
            right: -15%;
            top: -30%;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(232, 255, 71, 0.18) 0%, transparent 70%);
            animation: drift 12s ease-in-out infinite alternate;
        }

        .closing-inner {
            position: relative;
            width: min(720px, 100%);
            display: grid;
            gap: 1.25rem;
        }

        .closing h2 {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: clamp(1.85rem, 4.5vw, 3rem);
            letter-spacing: -0.035em;
            line-height: 1.1;
        }

        .closing p {
            color: rgba(255, 255, 255, 0.75);
            max-width: 38ch;
        }

        .site-footer {
            padding: 1.25rem clamp(1.25rem, 4vw, 3rem);
            background: var(--ink);
            color: rgba(255, 255, 255, 0.55);
            font-size: 0.8125rem;
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .site-footer strong {
            color: var(--white);
            font-family: var(--font-display);
            font-weight: 700;
            letter-spacing: -0.03em;
        }

        @keyframes riseIn {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroZoom {
            from { transform: scale(1.06); }
            to { transform: scale(1); }
        }

        @keyframes drift {
            from { transform: translate(0, 0); }
            to { transform: translate(-4%, 6%); }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
            .brand-mark, .hero h1, .hero-lead, .cta-row { opacity: 1; }
            .hero-media img { transform: none; }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <a class="logo" href="{{ url('/') }}">M1</a>
        <a class="nav-cta" href="#start">Get started</a>
    </header>

    <section class="hero" aria-label="M1 introduction">
        <div class="hero-media" aria-hidden="true">
            <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=2400&q=80"
                alt=""
                width="2400"
                height="1600"
                fetchpriority="high"
            >
        </div>
        <div class="hero-grain" aria-hidden="true"></div>
        <div class="hero-content">
            <p class="brand-mark">M1</p>
            <h1>Operations that stay ahead of the road</h1>
            <p class="hero-lead">One workspace to plan routes, sync teams, and deliver every day with less noise.</p>
            <div class="cta-row">
                <a class="btn btn-primary" href="#start">Start free</a>
                <a class="btn btn-ghost" href="#purpose">See how it works</a>
            </div>
        </div>
    </section>

    <section class="purpose" id="purpose">
        <div class="purpose-inner">
            <h2>Clarity from dispatch to doorstep</h2>
            <p>M1 brings live status, clean handoffs, and simple planning into one view — so your team spends less time chasing updates and more time moving.</p>
        </div>
    </section>

    <section class="closing" id="start">
        <div class="closing-inner">
            <h2>Ready when your fleet is</h2>
            <p>Set up in minutes. Invite your team. Run the next shift with a quieter, clearer dashboard.</p>
            <div class="cta-row">
                <a class="btn btn-primary" href="mailto:hello@m1.example">Talk to us</a>
            </div>
        </div>
    </section>

    <footer class="site-footer">
        <span><strong>M1</strong> · Operations, simplified</span>
        <span>&copy; {{ date('Y') }} M1</span>
    </footer>
</body>
</html>
