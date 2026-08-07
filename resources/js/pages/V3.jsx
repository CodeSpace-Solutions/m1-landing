import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES } from '../data/paperCatalog';
import TypeText from '../components/TypeText';
import TypeAccentLine from '../components/TypeAccentLine';
import Kicker from '../components/Kicker';
import WordRoller from '../components/WordRoller';
import MorphBadge from '../components/MorphBadge';
import { typeDelays } from '../lib/typeDelays';
import { useScrollReveal } from '../lib/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#ec3013';
const KICKER_GRADIENT = 'linear-gradient(90deg, #ec3013 0%, #ec3013 42%, #ff8a70 50%, #ec3013 58%, #ec3013 100%)';

const WHATSAPP = '+60 12-345 6789';
const WA_HREF = 'https://wa.me/' + WHATSAPP.replace(/[^0-9]/g, '');

const PRODUCTS = CATEGORIES.flatMap((category) =>
    category.items.map(([name, spec], index) => ({
        cat: category.en,
        name,
        spec,
        image: `/images/products/${category.imageFolder}/${String(index + 1).padStart(2, '0')}.png?v=logo-fixed-v2-4x3`,
    })),
);

const TABS = [
    { en: 'All', bm: 'Semua', match: null },
    ...CATEGORIES.map((category) => ({
        en: category.en,
        bm: category.bm,
        match: category.en,
    })),
];

const ICONS = {
    badge: ['M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76', 'm9 12 2 2 4-4'],
    store: ['M2 7 4.41 2.59A1 1 0 0 1 5.3 2h13.4a1 1 0 0 1 .89.59L22 7', 'M4 7v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7', 'M2 7h20', 'M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6'],
    box: ['M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
    truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14', 'M17 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0', 'M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0'],
    quality: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
    layers: ['m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z', 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65', 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65'],
    tag: ['M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z', 'M7.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2'],
};

function Icon({ paths, size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
}

const T = {
    en: {
        navProducts: 'Products', navAbout: 'About us', navWhy: 'Why choose us', navContact: 'Contact', navCta: 'Get in touch',
        heroL1: 'The best value', heroL2: 'printing materials', heroL3: 'in Malaysia',
        heroSub1: 'Trusted wholesale supplier for printing shops.', heroSub2: 'Quality materials. Consistent supply. Competitive pricing.',
        heroCta: 'Explore products',
        s1: 'Years Experience', s2: 'Printing Shops', s3: 'Products', s4: 'Delivery', s4v: 'Nationwide',
        prodKicker: 'Our products', prodTitle: 'Quality Materials for Every Need', viewDetails: 'View details',
        aboutKicker: 'About M1', aboutTitle: 'Your Trusted Partner in Printing Business',
        aboutCopy1: 'M1 is a wholesale supplier of premium printing materials in Malaysia. We are committed to providing consistent quality, stable supply and the best value to support your business growth.',
        learnMore: 'Learn more',
        whyKicker: 'Why choose M1', whyTitle: 'The M1 Advantage',
        why: [
            { title: 'Premium Quality', copy: 'Carefully selected materials from reliable manufacturers.' },
            { title: 'Stable Supply', copy: 'Large inventory and strong supply chain.' },
            { title: 'Fast Delivery', copy: 'Nationwide delivery to keep your business running.' },
            { title: 'Competitive Pricing', copy: 'Best wholesale pricing for printing professionals.' },
        ],
        contactKicker: "Let's grow together", contactTitle: 'Contact Us',
        contactCopy: 'Have questions or need a quotation? Our team is ready to help.',
        hours: 'Mon - Sat: 9:00 AM - 6:00 PM', waBtn: 'WhatsApp us',
        fCompany: 'Company Name', fName: 'Your Name', fPhone: 'Phone Number', fEmail: 'Email Address', fMsg: 'Message',
        fSend: 'Send message', fSent: 'Sent — we will be in touch',
        fCompanyCol: 'Company', fSupport: 'Support', follow: 'Follow us', rights: 'All rights reserved.',
        deliverPrefix: 'We deliver on your', deliverWords: ['schedule.', 'terms.', 'budget.', 'timeline.', 'schedule.'],
        morphQ: 'No markup?', morphA: 'fair!',
    },
    bm: {
        navProducts: 'Produk', navAbout: 'Tentang kami', navWhy: 'Kenapa pilih kami', navContact: 'Hubungi', navCta: 'Hubungi kami',
        heroL1: 'Bahan cetakan', heroL2: 'nilai terbaik', heroL3: 'di Malaysia',
        heroSub1: 'Pembekal borong dipercayai untuk kedai cetak.', heroSub2: 'Bahan berkualiti. Bekalan konsisten. Harga kompetitif.',
        heroCta: 'Terokai produk',
        s1: 'Tahun Pengalaman', s2: 'Kedai Cetak', s3: 'Produk', s4: 'Penghantaran', s4v: 'Seluruh Negara',
        prodKicker: 'Produk kami', prodTitle: 'Bahan Berkualiti untuk Setiap Keperluan', viewDetails: 'Lihat butiran',
        aboutKicker: 'Tentang M1', aboutTitle: 'Rakan Dipercayai dalam Perniagaan Percetakan',
        aboutCopy1: 'M1 ialah pembekal borong bahan cetakan premium di Malaysia. Kami komited menyediakan kualiti konsisten, bekalan stabil dan nilai terbaik untuk menyokong pertumbuhan perniagaan anda.',
        learnMore: 'Ketahui lanjut',
        whyKicker: 'Kenapa pilih M1', whyTitle: 'Kelebihan M1',
        why: [
            { title: 'Kualiti Premium', copy: 'Bahan dipilih teliti daripada pengeluar yang dipercayai.' },
            { title: 'Bekalan Stabil', copy: 'Inventori besar dan rantaian bekalan yang kukuh.' },
            { title: 'Penghantaran Pantas', copy: 'Penghantaran seluruh negara untuk memastikan perniagaan anda berjalan.' },
            { title: 'Harga Kompetitif', copy: 'Harga borong terbaik untuk profesional percetakan.' },
        ],
        contactKicker: 'Mari berkembang bersama', contactTitle: 'Hubungi Kami',
        contactCopy: 'Ada soalan atau perlukan sebut harga? Pasukan kami sedia membantu.',
        hours: 'Isn - Sab: 9:00 AM - 6:00 PM', waBtn: 'WhatsApp kami',
        fCompany: 'Nama Syarikat', fName: 'Nama Anda', fPhone: 'Nombor Telefon', fEmail: 'Alamat E-mel', fMsg: 'Mesej',
        fSend: 'Hantar mesej', fSent: 'Dihantar — kami akan hubungi anda',
        fCompanyCol: 'Syarikat', fSupport: 'Sokongan', follow: 'Ikuti kami', rights: 'Hak cipta terpelihara.',
        deliverPrefix: 'Kami hantar mengikut', deliverWords: ['jadual.', 'terma.', 'bajet.', 'garis masa.', 'jadual.'],
        morphQ: 'Tiada markup?', morphA: 'adil!',
    },
};

function CountStat({ icon, target, suffix, value, label }) {
    const ref = useRef(null);
    const numRef = useRef(null);
    const [display, setDisplay] = useState(target ? '0' + suffix : value);

    useEffect(() => {
        const el = ref.current;
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                io.disconnect();
                gsap.fromTo(
                    numRef.current,
                    { scale: 0.6, color: '#5b5b60' },
                    { scale: 1, color: '#ffffff', duration: 0.6, ease: 'back.out(2.4)' },
                );
                if (!target) { setDisplay(value); return; }
                const obj = { v: 0 };
                gsap.to(obj, {
                    v: target,
                    duration: 1.4,
                    ease: 'power3.out',
                    onUpdate: () => setDisplay(Math.round(obj.v) + suffix),
                });
            },
            { threshold: 0.3 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [target, suffix, value]);

    return (
        <div ref={ref} className="flex items-center gap-4">
            <span className="inline-flex h-11.5 w-11.5 flex-shrink-0 items-center justify-center rounded-full border border-[#3a3a3f] text-[#e4e4e7]">{icon}</span>
            <div>
                <p ref={numRef} className="m-0 inline-block text-[22px] font-black" style={{ transformOrigin: '0% 50%' }}>{display}</p>
                <p className="mt-0.5 text-[13.5px] text-[#9b9b9f]">{label}</p>
            </div>
        </div>
    );
}

export default function V3() {
    const [lang, setLang] = useState('en');
    const [cat, setCat] = useState(0);
    const [tick, setTick] = useState(0);
    const [sent, setSent] = useState(false);
    const scopeRef = useRef(null);
    useScrollReveal(scopeRef);

    const t = T[lang];
    const tab = TABS[cat];
    const products = useMemo(() => {
        const pool = tab.match ? PRODUCTS.filter((p) => p.cat === tab.match) : PRODUCTS;
        return pool;
    }, [tab]);

    const stats = [
        { icon: <Icon paths={ICONS.badge} />, target: 20, suffix: '+', label: t.s1 },
        { icon: <Icon paths={ICONS.store} />, target: 500, suffix: '+', label: t.s2 },
        { icon: <Icon paths={ICONS.box} />, target: PRODUCTS.length, suffix: '', label: t.s3 },
        { icon: <Icon paths={ICONS.truck} />, target: 0, suffix: '', value: t.s4v, label: t.s4 },
    ];
    const whyIcons = [ICONS.quality, ICONS.layers, ICONS.truck, ICONS.tag];
    const heroDelays = useMemo(() => typeDelays([t.heroL1, t.heroL2, t.heroL3], 40, 150, 120), [t.heroL1, t.heroL2, t.heroL3]);
    const heroDoneSec = (heroDelays[2] + t.heroL3.length * 40 + 300) / 1000;

    return (
        <div ref={scopeRef}>
            <section style={{ background: '#0b0b0c', color: '#fff' }}>
                <nav className="mx-auto flex max-w-[1600px] items-center gap-6 px-5 py-5.5 md:gap-10 md:px-12">
                    <span className="inline-flex rounded bg-white px-2 py-1">
                        <img src="/images/m-one-logo.png" alt="M One Material" className="h-9 w-auto" />
                    </span>
                    <div className="ml-auto flex flex-wrap items-center gap-4 md:gap-8">
                        <a href="#products" className="hidden text-[12.5px] font-bold tracking-[0.1em] text-[#d4d4d8] uppercase no-underline hover:text-[#ec3013] sm:inline">{t.navProducts}</a>
                        <a href="#about" className="hidden text-[12.5px] font-bold tracking-[0.1em] text-[#d4d4d8] uppercase no-underline hover:text-[#ec3013] sm:inline">{t.navAbout}</a>
                        <a href="#why" className="hidden text-[12.5px] font-bold tracking-[0.1em] text-[#d4d4d8] uppercase no-underline hover:text-[#ec3013] sm:inline">{t.navWhy}</a>
                        <a href="#contact" className="hidden text-[12.5px] font-bold tracking-[0.1em] text-[#d4d4d8] uppercase no-underline hover:text-[#ec3013] sm:inline">{t.navContact}</a>
                        <span className="inline-flex items-center gap-0.5">
                            <button type="button" onClick={() => setLang('en')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'en' ? ACCENT : '#71717a' }}>EN</button>
                            <span className="text-xs text-[#52525b]">/</span>
                            <button type="button" onClick={() => setLang('bm')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'bm' ? ACCENT : '#71717a' }}>BM</button>
                        </span>
                        <a href="#contact" className="whitespace-nowrap rounded-full px-6 py-3 text-[12.5px] font-extrabold tracking-[0.08em] text-white uppercase no-underline hover:opacity-90" style={{ background: ACCENT }}>{t.navCta}</a>
                    </div>
                </nav>

                <div className="mx-auto grid max-w-[1600px] items-stretch gap-8 px-5 pt-8 md:gap-12 md:px-12 md:pt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)]">
                    <div key={lang} className="flex flex-col justify-center pb-8 md:pb-14">
                        <h1 className="m-0 text-[36px] leading-[1.12] font-black tracking-tight uppercase sm:text-[46px] lg:text-[54px]">
                            <span className="block" style={lang === 'en' ? { color: ACCENT } : undefined}>
                                {lang === 'en' ? (
                                    <TypeAccentLine text={t.heroL1} delay={heroDelays[0]} speed={40} accent={ACCENT} from="#9b9b9f" />
                                ) : (
                                    <TypeText text={t.heroL1} delay={heroDelays[0]} speed={40} />
                                )}
                            </span>
                            <span className="block" style={lang === 'bm' ? { color: ACCENT } : undefined}>
                                {lang === 'bm' ? (
                                    <TypeAccentLine text={t.heroL2} delay={heroDelays[1]} speed={40} accent={ACCENT} from="#9b9b9f" />
                                ) : (
                                    <TypeText text={t.heroL2} delay={heroDelays[1]} speed={40} />
                                )}
                            </span>
                            <span className="block">
                                <TypeAccentLine
                                    text={t.heroL3}
                                    delay={heroDelays[2]}
                                    speed={40}
                                    from="transparent"
                                    accent="#ffffff"
                                    style={{ WebkitTextStroke: '1.5px #9b9b9f' }}
                                />
                            </span>
                        </h1>
                        <p className="m3-rise mt-6.5 max-w-[46ch] text-[16px] leading-[1.75] text-[#b9b9bf]" style={{ animationDelay: `${heroDoneSec}s` }}>{t.heroSub1}<br />{t.heroSub2}</p>
                        <div className="m3-rise mt-8" style={{ animationDelay: `${heroDoneSec + 0.1}s` }}>
                            <a href="#products" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md bg-[#ec3013] px-7.5 py-3.5 text-[12.5px] font-extrabold tracking-[0.1em] text-white uppercase no-underline hover:bg-[#ae1800]">
                                {t.heroCta}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="m3-rise relative min-h-[420px] overflow-hidden md:min-h-[560px] lg:min-h-[min(72vh,720px)]" style={{ animationDelay: '.2s' }}>
                        <img src="/images/hero/hero3.png" alt="M One Material printing facility" className="absolute inset-0 h-full w-full object-cover object-center" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg,#0b0b0c 0%,rgba(11,11,12,0) 28%),linear-gradient(0deg,rgba(11,11,12,.4) 0%,rgba(11,11,12,0) 28%)' }} />
                    </div>
                </div>

                <div className="border-t border-[#232326]">
                    <div className="mx-auto grid max-w-[1600px] gap-6 px-5 py-7 md:px-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
                        {stats.map((s) => <CountStat key={s.label} {...s} />)}
                    </div>
                </div>
            </section>

            <section id="products" style={{ background: '#fafafa' }}>
                <div className="mx-auto max-w-[1600px] px-5 py-18 pb-21 md:px-12">
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="text-xs font-extrabold tracking-[0.14em] uppercase">{t.prodKicker}</Kicker>
                        <h2 className="m-0 mt-2.5 text-[26px] font-black tracking-tight sm:text-[38px]">{t.prodTitle}</h2>
                    </div>
                    <div data-reveal role="tablist" className="mt-7 flex flex-wrap gap-2.5">
                        {TABS.map((c, i) => (
                            <button
                                key={c.en}
                                type="button"
                                role="tab"
                                onClick={() => { setCat(i); setTick((n) => n + 1); }}
                                className="cursor-pointer rounded whitespace-nowrap px-5 py-2.5 text-[13.5px] font-bold transition-colors"
                                style={{
                                    border: i === cat ? `1px solid ${ACCENT}` : '1px solid #d4d4d8',
                                    background: i === cat ? ACCENT : '#fff',
                                    color: i === cat ? '#fff' : '#52525b',
                                }}
                            >
                                {c[lang]}
                            </button>
                        ))}
                    </div>
                    <div data-reveal key={tick} className="m3-fade">
                        <div className="mt-8 grid gap-5.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))' }}>
                            {products.map((p) => (
                                <div key={p.name} className="flex flex-col overflow-hidden rounded-md bg-white transition-all hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,.1)]">
                                    <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/3] w-full bg-white object-contain" />
                                    <div className="flex flex-1 flex-col gap-1 border-t border-[#f0f0f1] px-5 pt-4.5 pb-5">
                                        <p className="m-0 text-[16px] leading-tight font-extrabold">{p.name}</p>
                                        {p.spec && <p className="m-0 text-[13.5px] text-[#71717a]">{p.spec}</p>}
                                        <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-3.5 inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.08em] uppercase no-underline hover:opacity-80" style={{ color: ACCENT }}>
                                            {t.viewDetails}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="bg-white">
                <div className="grid items-stretch" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
                    <div data-reveal className="ml-auto max-w-[600px] self-center px-5 py-14 md:px-12 md:py-22">
                        <Kicker gradient={KICKER_GRADIENT} className="text-xs font-extrabold tracking-[0.14em] uppercase">{t.aboutKicker}</Kicker>
                        <h2 className="m-0 mt-2.5 text-[26px] leading-tight font-black tracking-tight sm:text-[38px]">{t.aboutTitle}</h2>
                        <p className="mt-4.5 max-w-[48ch] text-[15px] leading-[1.8] text-[#52525b]">{t.aboutCopy1}</p>
                        <div className="mt-6.5">
                            <a href="#why" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md border-[1.5px] border-[#ec3013] px-6.5 py-3 text-xs font-extrabold tracking-[0.1em] text-[#ec3013] uppercase no-underline hover:bg-[#ec3013] hover:text-white">
                                {t.learnMore}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="relative min-h-[340px]">
                        <img src="/images/about-us/aboutUs.png" alt="M One Material warehouse" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0) 40%)' }} />
                    </div>
                </div>
            </section>

            <section className="border-t border-[#ececee] bg-white py-12 text-center md:py-16">
                <p className="m-0 text-[22px] leading-snug font-black tracking-tight uppercase sm:text-[30px]">
                    {t.deliverPrefix}{' '}
                    <WordRoller words={t.deliverWords} className="min-w-[7ch] text-[#ec3013]" itemClassName="text-left text-[#ec3013]" style={{ color: ACCENT }} />
                </p>
            </section>

            <section id="why" className="border-t border-[#ececee]" style={{ background: '#fafafa' }}>
                <div className="mx-auto max-w-[1600px] px-5 py-18 pb-21 md:px-12">
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="text-xs font-extrabold tracking-[0.14em] uppercase">{t.whyKicker}</Kicker>
                        <h2 className="m-0 mt-2.5 text-[26px] font-black tracking-tight sm:text-[38px]">{t.whyTitle}</h2>
                    </div>
                    <div className="mt-11 grid gap-8 sm:gap-11" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
                        {t.why.map((w, i) => (
                            <div key={w.title} data-reveal className="flex items-start gap-4">
                                <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#f5c4bb] bg-[#fde8e4]" style={{ color: ACCENT }}>
                                    <Icon paths={whyIcons[i]} />
                                </span>
                                <div>
                                    <h3 className="m-0 text-[16.5px] font-extrabold">{w.title}</h3>
                                    <p className="mt-2 text-sm leading-[1.7] text-[#52525b]">{w.copy}</p>
                                    {i === 3 && (
                                        <p className="mt-2 text-sm font-bold">
                                            <MorphBadge question={t.morphQ} answer={t.morphA} gold={ACCENT} />
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="border-t border-[#ececee] bg-white">
                <div className="mx-auto max-w-[1600px] px-5 py-18 pb-21 md:px-12">
                    <div data-reveal className="max-w-[640px]">
                        <Kicker gradient={KICKER_GRADIENT} className="text-xs font-extrabold tracking-[0.14em] uppercase">{t.contactKicker}</Kicker>
                        <h2 className="m-0 mt-2.5 text-[26px] font-black tracking-tight sm:text-[38px]">{t.contactTitle}</h2>
                        <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.8] text-[#52525b]">{t.contactCopy}</p>
                    </div>

                    <div data-reveal className="mt-10 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
                        <div className="min-h-[280px] overflow-hidden rounded-md border border-[#ececee] lg:min-h-full">
                            <video
                                src="/video/HappyHorse-20260807-0001-1786071399113.mp4"
                                className="h-full w-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                aria-label="Warehouse location"
                            />
                        </div>

                        <div className="flex flex-col gap-7 rounded-md border border-[#ececee] bg-[#fafafa] p-6 md:p-8">
                            <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex flex-shrink-0" style={{ color: ACCENT }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
                                    <span className="text-[14px] leading-snug font-semibold">+60 12-345 6789</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex flex-shrink-0" style={{ color: ACCENT }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></span>
                                    <span className="text-[14px] leading-snug font-semibold break-all">sales@m1.com.my</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex flex-shrink-0" style={{ color: ACCENT }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>
                                    <span className="text-[14px] leading-snug font-semibold">{t.hours}</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-[#e4e4e7]" />

                            <form
                                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                                className="grid flex-1 content-start gap-4"
                                style={{ gridTemplateColumns: '1fr 1fr' }}
                            >
                                <input type="text" placeholder={t.fCompany} className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#ec3013]" />
                                <input type="text" placeholder={t.fName} required className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#ec3013]" />
                                <input type="text" placeholder={t.fPhone} className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#ec3013]" />
                                <input type="email" placeholder={t.fEmail} required className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#ec3013]" />
                                <textarea placeholder={t.fMsg} rows={5} className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#ec3013]" style={{ gridColumn: '1 / -1' }} />
                                <div className="flex flex-wrap items-center gap-3" style={{ gridColumn: '1 / -1' }}>
                                    <button type="submit" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md px-7 py-3.5 text-xs font-extrabold tracking-[0.1em] text-white uppercase hover:opacity-90" style={{ background: ACCENT }}>
                                        {sent ? t.fSent : t.fSend}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </button>
                                    <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md border-[1.5px] border-[#ec3013] px-6 py-3 text-xs font-extrabold tracking-[0.1em] text-[#ec3013] uppercase no-underline hover:bg-[#ec3013] hover:text-white">
                                        {t.waBtn}
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ background: '#0b0b0c', color: '#9b9b9f' }}>
                <div className="mx-auto grid max-w-[1600px] gap-9 px-5 pt-13 pb-10 md:px-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
                    <div>
                        <span className="inline-flex rounded bg-white px-2 py-1">
                            <img src="/images/m-one-logo.png" alt="M One Material" className="h-11 w-auto" />
                        </span>
                        <p className="mt-3.5 text-[13px] leading-[1.7]">© 2026 M1 Printing Materials.<br />{t.rights}</p>
                    </div>
                    <div>
                        <p className="m-0 mb-3 text-[13px] font-extrabold text-white">{t.navProducts}</p>
                        <div className="grid gap-2">
                            {TABS.slice(1).map((c) => (
                                <a key={c.en} href="#products" className="text-[13.5px] text-[#9b9b9f] no-underline hover:text-white">{c[lang]}</a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="m-0 mb-3 text-[13px] font-extrabold text-white">{t.fCompanyCol}</p>
                        <div className="grid gap-2">
                            <a href="#about" className="text-[13.5px] text-[#9b9b9f] no-underline hover:text-white">{t.navAbout}</a>
                            <a href="#why" className="text-[13.5px] text-[#9b9b9f] no-underline hover:text-white">{t.navWhy}</a>
                        </div>
                    </div>
                    <div>
                        <p className="m-0 mb-3 text-[13px] font-extrabold text-white">{t.fSupport}</p>
                        <div className="grid gap-2">
                            <a href="#contact" className="text-[13.5px] text-[#9b9b9f] no-underline hover:text-white">{t.navContact}</a>
                        </div>
                    </div>
                    <div>
                        <p className="m-0 mb-3 text-[13px] font-extrabold text-white">{t.follow}</p>
                        <div className="flex gap-3">
                            <a href="#contact" aria-label="Facebook" className="inline-flex text-[#9b9b9f] hover:text-white"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex text-[#9b9b9f] hover:text-white"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" /></svg></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
