import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES } from '../data/paperCatalog';
import TypeText from '../components/TypeText';
import TypeAccentLine from '../components/TypeAccentLine';
import Kicker from '../components/Kicker';
import WhyScrollStory from '../components/WhyScrollStory';
import ShineChars from '../components/ShineChars';
import { typeDelays } from '../lib/typeDelays';
import { useScrollReveal } from '../lib/useScrollReveal';
import { useInViewVideo } from '../lib/useWhenVisible';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#ec3013';
const KICKER_GRADIENT = 'linear-gradient(90deg, #ec3013 0%, #ec3013 42%, #ff8a70 50%, #ec3013 58%, #ec3013 100%)';
const AUTO_SCROLL_PX_PER_SEC = 120;
const AUTO_SCROLL_LOOP_DELAY_MS = 1200;
const AUTO_SCROLL_HERO_HOLD_MS = 2000;
const AUTO_SCROLL_CONTACT_HOLD_MS = 3000;
const AUTO_SCROLL_WHY_TARGET_MS = 800;

const CONTACTS = [
    {
        name: 'Eddy Ng',
        role: 'Sales Manager',
        email: 'eddyng.m1adv@gmail.com',
        phone: '0127073098',
    },
    {
        name: 'CP Yii',
        role: 'Sales Executive',
        email: 'cp.m1adv@gmail.com',
        phone: '0127673098',
    },
    {
        name: 'Ken Lau',
        role: 'Sales Executive',
        email: 'ken.m1adv@gmail.com',
        phone: '0126993098',
    },
];

const PRIMARY_CONTACT = CONTACTS[0];
const toWhatsAppHref = (phone, message) => {
    const num = phone.replace(/^0/, '60').replace(/[^0-9]/g, '');
    const base = `https://wa.me/${num}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
const productWhatsAppMessage = (product, lang) => {
    if (!product) return undefined;
    const name = lang === 'bm' ? product.nameBm : product.nameEn;
    const category = lang === 'bm' ? (product.catBm || product.cat) : product.cat;
    const lines = lang === 'bm'
        ? [
            'Hi, saya ingin tanya butiran produk ini:',
            `Produk: ${name}`,
            product.spec ? `Spec: ${product.spec}` : null,
            category ? `Kategori: ${category}` : null,
        ]
        : [
            'Hi, I would like to ask details about this product:',
            `Product: ${name}`,
            product.spec ? `Spec: ${product.spec}` : null,
            category ? `Category: ${category}` : null,
        ];
    return lines.filter(Boolean).join('\n');
};
const formatPhoneDisplay = (phone) => {
    const normalized = phone.replace(/[^0-9]/g, '');
    const local = normalized.startsWith('0') ? normalized.slice(1) : normalized;

    if (local.length === 9) {
        return `+60 ${local.slice(0, 2)}-${local.slice(2, 5)} ${local.slice(5)}`;
    }

    return `+60 ${local}`;
};
const WA_HREF = toWhatsAppHref(PRIMARY_CONTACT.phone);

const PRODUCTS = CATEGORIES.flatMap((category) =>
    category.items.map(([nameEn, nameBm, spec], index) => ({
        cat: category.en,
        catBm: category.bm,
        nameEn,
        nameBm,
        spec,
        image: `/images/products/${category.imageFolder}/${String(index + 1).padStart(2, '0')}.png?v=cross-base-update`,
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
        autoModeOn: 'Auto mode on', autoModeOff: 'Auto mode off',
        heroL1: 'The best value', heroL2: 'printing materials', heroL3: 'in Malaysia',
        heroSub1: 'Trusted wholesale supplier for printing shops.', heroSub2: 'Quality materials. Consistent supply. Competitive pricing.',
        heroCta: 'Explore products',
        s1: 'Years Experience', s2: 'Printing Shops', s3: 'Products', s4: 'Delivery', s4v: 'Nationwide',
        prodKicker: 'Our products', prodTitle: 'Quality Materials for Every Need', viewDetails: 'Ask details',
        aboutKicker: 'About M1', aboutTitle: 'Your Trusted Partner in Printing Business', aboutShine: 'Trusted Partner', aboutAccent: 'Printing Business',
        aboutCopy1: 'M1 is a wholesale supplier of premium printing materials in Malaysia. We are committed to providing consistent quality, stable supply and the best value to support your business growth.',
        learnMore: 'Learn more',
        whyStory: {
            hud: 'WHY CHOOSE US',
            panel: 'WHY CHOOSE US',
            scrollHint: 'SCROLL ↓',
            w1: 'PREMIUM QUALITY',
            w2: 'STABLE SUPPLY',
            w3: 'FAST DELIVERY',
            roller: ['COMPETITIVE', 'AFFORDABLE', 'UNBEATABLE', 'LOWEST', 'CHEAPEST'],
            pricingSuffix: 'PRICING',
            inMalaysia: 'IN MALAYSIA',
            logoTag: 'NO. 1 IN MALAYSIA',
        },
        contactKicker: "Let's grow together", contactTitle: 'Contact Us',
        contactCopy: 'Have questions or need a quotation? Our team is ready to help.',
        hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        emailReply: "We'll reply within 24 hours",
        address: 'NO 2, JALAN 6/15, KAWASAN PERINDUSTRIAN TERES, TAMAN TASEK TAMBAHAN, 68000 AMPANG, SELANGOR',
        waCardTitle: 'Chat with us on WhatsApp',
        waCardCopy: 'Get quick support and fast responses from our team.',
        waBtn: 'WhatsApp us',
        waChoosePrompt: 'Choose a sales contact',
        waChooseCopy: 'Select who you want to chat with:',
        waChooseClose: 'Close',
        fCompanyCol: 'Company', fSupport: 'Support', follow: 'Follow us',
        rights: 'All rights reserved.',
        footerBrand: '© 2026 M ONE ADVERTISING SDN. BHD.',
        footerSsm: '202501034310 (1635720-T)',
        footerNote: 'Wholesale printing materials, delivered nationwide.',
    },
    bm: {
        navProducts: 'Produk', navAbout: 'Tentang kami', navWhy: 'Kenapa pilih kami', navContact: 'Hubungi', navCta: 'Hubungi kami',
        autoModeOn: 'Mod auto hidup', autoModeOff: 'Mod auto mati',
        heroL1: 'Bahan cetakan', heroL2: 'nilai terbaik', heroL3: 'di Malaysia',
        heroSub1: 'Pembekal borong dipercayai untuk kedai cetak.', heroSub2: 'Bahan berkualiti. Bekalan konsisten. Harga kompetitif.',
        heroCta: 'Terokai produk',
        s1: 'Tahun Pengalaman', s2: 'Kedai Cetak', s3: 'Produk', s4: 'Penghantaran', s4v: 'Seluruh Negara',
        prodKicker: 'Produk kami', prodTitle: 'Bahan Berkualiti untuk Setiap Keperluan', viewDetails: 'Tanya butiran',
        aboutKicker: 'Tentang M1', aboutTitle: 'Rakan Dipercayai dalam Perniagaan Percetakan', aboutShine: 'Rakan Dipercayai', aboutAccent: 'Perniagaan Percetakan',
        aboutCopy1: 'M1 ialah pembekal borong bahan cetakan premium di Malaysia. Kami komited menyediakan kualiti konsisten, bekalan stabil dan nilai terbaik untuk menyokong pertumbuhan perniagaan anda.',
        learnMore: 'Ketahui lanjut',
        whyStory: {
            hud: 'KENAPA PILIH KAMI',
            panel: 'KENAPA PILIH KAMI',
            scrollHint: 'SKROL ↓',
            w1: 'KUALITI PREMIUM',
            w2: 'BEKALAN STABIL',
            w3: 'PENGHANTARAN PANTAS',
            roller: ['KOMPETITIF', 'BERBALOI', 'TERBAIK', 'TERENDAH', 'TERMURAH'],
            pricingSuffix: 'HARGA',
            pricingFirst: true,
            inMalaysia: 'DI MALAYSIA',
            logoTag: 'NO. 1 DI MALAYSIA',
        },
        contactKicker: 'Mari berkembang bersama', contactTitle: 'Hubungi Kami',
        contactCopy: 'Ada soalan atau perlukan sebut harga? Pasukan kami sedia membantu.',
        hours: 'Isn - Sab: 9:00 AM - 6:00 PM',
        emailReply: 'Kami balas dalam 24 jam',
        address: 'NO 2, JALAN 6/15, KAWASAN PERINDUSTRIAN TERES, TAMAN TASEK TAMBAHAN, 68000 AMPANG, SELANGOR',
        waCardTitle: 'Sembang dengan kami di WhatsApp',
        waCardCopy: 'Dapatkan sokongan pantas dan respons cepat daripada pasukan kami.',
        waBtn: 'WhatsApp kami',
        waChoosePrompt: 'Pilih pegawai jualan',
        waChooseCopy: 'Pilih siapa yang anda mahu hubungi.',
        waChooseClose: 'Tutup',
        fCompanyCol: 'Syarikat', fSupport: 'Sokongan', follow: 'Ikuti kami',
        rights: 'Hak cipta terpelihara.',
        footerBrand: '© 2026 M ONE ADVERTISING SDN. BHD.',
        footerSsm: '202501034310 (1635720-T)',
        footerNote: 'Bahan cetakan borong, dihantar ke seluruh negara.',
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
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [isWaPickerOpen, setIsWaPickerOpen] = useState(false);
    const [waPickerProduct, setWaPickerProduct] = useState(null);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const heroSectionRef = useRef(null);
    const whySectionRef = useRef(null);
    const contactSectionRef = useRef(null);
    const contactVideoRef = useRef(null);
    useInViewVideo(contactVideoRef);
    const closeWaPicker = () => {
        setIsWaPickerOpen(false);
        setWaPickerProduct(null);
    };
    const openWaPicker = (product = null) => {
        setWaPickerProduct(product);
        setIsWaPickerOpen(true);
    };
    const closeNav = () => setIsNavOpen(false);
    const toggleAutoMode = () => setIsAutoMode((enabled) => !enabled);
    const waPickerMessage = productWhatsAppMessage(waPickerProduct, lang);
    const scopeRef = useRef(null);
    useScrollReveal(scopeRef);

    useEffect(() => {
        if (!isWaPickerOpen && !isNavOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isWaPickerOpen, isNavOpen]);

    useEffect(() => {
        if (!isAutoMode || isWaPickerOpen || isNavOpen) return undefined;
        let frameId = 0;
        let restartTimeoutId = 0;
        let lastTs = 0;
        let isLooping = false;
        let holdUntilTs = 0;
        let hasHeldContactSection = false;

        const getWhyTrigger = () => {
            const why = whySectionRef.current;
            if (!why) return null;
            const whyStage = why.querySelector('.m3-why-story');
            if (!whyStage) return null;

            return ScrollTrigger.getAll().find((trigger) => trigger.trigger === whyStage || trigger.pin === whyStage) ?? null;
        };

        const isInHeroSection = () => {
            const hero = heroSectionRef.current;
            if (!hero) return false;
            const heroTop = hero.offsetTop;
            const heroBottom = heroTop + hero.offsetHeight;
            return window.scrollY >= heroTop && window.scrollY < heroBottom - 1;
        };

        const isInWhySection = () => {
            const why = whySectionRef.current;
            if (!why) return false;
            const whyTrigger = getWhyTrigger();

            if (whyTrigger) {
                return window.scrollY >= whyTrigger.start && window.scrollY < whyTrigger.end;
            }

            const whyTop = why.offsetTop;
            const whyBottom = whyTop + Math.max(why.offsetHeight, why.scrollHeight);
            return window.scrollY >= whyTop && window.scrollY < whyBottom;
        };

        const isInContactSection = () => {
            const contact = contactSectionRef.current;
            if (!contact) return false;
            const contactTop = contact.offsetTop;
            const contactBottom = contactTop + contact.offsetHeight;
            return window.scrollY >= contactTop && window.scrollY < contactBottom;
        };

        if (isInHeroSection()) {
            holdUntilTs = window.performance.now() + AUTO_SCROLL_HERO_HOLD_MS;
        }

        const tickScroll = (ts) => {
            if (isLooping) return;
            if (isInContactSection() && !hasHeldContactSection) {
                holdUntilTs = ts + AUTO_SCROLL_CONTACT_HOLD_MS;
                hasHeldContactSection = true;
            }
            if (!isInContactSection()) {
                hasHeldContactSection = false;
            }
            if (holdUntilTs && ts < holdUntilTs) {
                lastTs = ts;
                frameId = window.requestAnimationFrame(tickScroll);
                return;
            }
            if (holdUntilTs && ts >= holdUntilTs) {
                holdUntilTs = 0;
                lastTs = ts;
                frameId = window.requestAnimationFrame(tickScroll);
                return;
            }
            if (!lastTs) {
                lastTs = ts;
                frameId = window.requestAnimationFrame(tickScroll);
                return;
            }

            const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            if (maxScrollTop <= 0) return;

            const delta = ts - lastTs;
            lastTs = ts;
            const whyTrigger = getWhyTrigger();
            const whySpeed = whyTrigger
                ? ((Math.max(whyTrigger.end - whyTrigger.start, window.innerHeight) / AUTO_SCROLL_WHY_TARGET_MS) * 1000)
                : AUTO_SCROLL_PX_PER_SEC;
            const speed = isInWhySection() ? whySpeed : AUTO_SCROLL_PX_PER_SEC;
            const distance = (speed * delta) / 1000;
            const nextTop = Math.min(window.scrollY + distance, maxScrollTop);

            window.scrollTo({ top: nextTop, behavior: 'auto' });

            if (nextTop >= maxScrollTop - 1) {
                isLooping = true;
                restartTimeoutId = window.setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    lastTs = 0;
                    holdUntilTs = window.performance.now() + AUTO_SCROLL_HERO_HOLD_MS;
                    hasHeldContactSection = false;
                    isLooping = false;
                    frameId = window.requestAnimationFrame(tickScroll);
                }, AUTO_SCROLL_LOOP_DELAY_MS);
                return;
            }

            frameId = window.requestAnimationFrame(tickScroll);
        };

        frameId = window.requestAnimationFrame(tickScroll);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(restartTimeoutId);
        };
    }, [isAutoMode, isWaPickerOpen, isNavOpen]);

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
    const heroDelays = useMemo(() => typeDelays([t.heroL1, t.heroL2, t.heroL3], 40, 150, 120), [t.heroL1, t.heroL2, t.heroL3]);
    const heroDoneSec = (heroDelays[2] + t.heroL3.length * 40 + 300) / 1000;

    return (
        <div ref={scopeRef} className="min-w-0 overflow-x-clip">
            <nav className="sticky top-0 z-40 border-b border-[#ececee] bg-white">
                <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3.5 sm:gap-6 sm:px-5 sm:py-5.5 md:gap-10 md:px-12">
                    <span className="inline-flex min-w-0 shrink">
                        <img src="/images/m-one-logo.png" alt="M One Material" className="h-9 w-auto sm:h-12 md:h-14" />
                    </span>
                    <div className="ml-auto hidden flex-wrap items-center gap-4 md:flex md:gap-8">
                        <a href="#products" className="text-[12.5px] font-bold tracking-[0.1em] text-[#52525b] uppercase no-underline hover:text-[#ec3013]">{t.navProducts}</a>
                        <a href="#about" className="text-[12.5px] font-bold tracking-[0.1em] text-[#52525b] uppercase no-underline hover:text-[#ec3013]">{t.navAbout}</a>
                        <a href="#why" className="text-[12.5px] font-bold tracking-[0.1em] text-[#52525b] uppercase no-underline hover:text-[#ec3013]">{t.navWhy}</a>
                        <a href="#contact" className="text-[12.5px] font-bold tracking-[0.1em] text-[#52525b] uppercase no-underline hover:text-[#ec3013]">{t.navContact}</a>
                        <span className="inline-flex items-center gap-0.5">
                            <button type="button" onClick={() => setLang('en')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'en' ? ACCENT : '#a1a1aa' }}>EN</button>
                            <span className="text-xs text-[#d4d4d8]">/</span>
                            <button type="button" onClick={() => setLang('bm')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'bm' ? ACCENT : '#a1a1aa' }}>BM</button>
                        </span>
                        <a href="#contact" className="whitespace-nowrap rounded-full px-6 py-3 text-[12.5px] font-extrabold tracking-[0.08em] text-white uppercase no-underline hover:opacity-90" style={{ background: ACCENT }}>{t.navCta}</a>
                    </div>
                    <div className="ml-auto flex items-center gap-2 md:hidden">
                        <span className="inline-flex items-center gap-0.5">
                            <button type="button" onClick={() => setLang('en')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'en' ? ACCENT : '#a1a1aa' }}>EN</button>
                            <span className="text-xs text-[#d4d4d8]">/</span>
                            <button type="button" onClick={() => setLang('bm')} className="p-1 text-xs font-extrabold" style={{ color: lang === 'bm' ? ACCENT : '#a1a1aa' }}>BM</button>
                        </span>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ececee] text-[#161616]"
                            aria-expanded={isNavOpen}
                            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
                            onClick={() => setIsNavOpen((open) => !open)}
                        >
                            {isNavOpen ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                                    <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                {isNavOpen && (
                    <div className="border-t border-[#ececee] bg-white px-4 py-4 md:hidden">
                        <div className="mx-auto flex max-w-[1600px] flex-col gap-1">
                            {[
                                ['#products', t.navProducts],
                                ['#about', t.navAbout],
                                ['#why', t.navWhy],
                                ['#contact', t.navContact],
                            ].map(([href, label]) => (
                                <a
                                    key={href}
                                    href={href}
                                    onClick={closeNav}
                                    className="rounded-lg px-3 py-3 text-[13px] font-bold tracking-[0.1em] text-[#52525b] uppercase no-underline hover:bg-[#fafafa] hover:text-[#ec3013]"
                                >
                                    {label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={closeNav}
                                className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-[12.5px] font-extrabold tracking-[0.08em] text-white uppercase no-underline"
                                style={{ background: ACCENT }}
                            >
                                {t.navCta}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            <section
                id="home"
                ref={heroSectionRef}
                className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden sm:min-h-[calc(100dvh-5.75rem)]"
                style={{ background: '#0b0b0c', color: '#fff' }}
            >
                <div
                    className="m3-rise pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] lg:block xl:w-[64%]"
                    style={{ animationDelay: '.2s' }}
                >
                    <img src="/images/hero/hero3.png" alt="M One Material printing facility" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg,#0b0b0c 0%,rgba(11,11,12,.28) 18%,rgba(11,11,12,0) 38%),linear-gradient(180deg,rgba(11,11,12,.18) 0%,rgba(11,11,12,0) 18%)' }}
                    />
                </div>
                <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-8 sm:min-h-[calc(100dvh-5.75rem)] sm:gap-8 sm:px-5 sm:py-10 md:px-12 lg:flex-row lg:items-center lg:py-0">
                    <div key={lang} className="flex w-full max-w-[640px] min-w-0 flex-col justify-center py-2 sm:py-4 md:py-10 lg:w-[38%] lg:max-w-none lg:pr-6">
                        <h1 className="m-0 text-[28px] leading-[1.12] font-black tracking-tight uppercase break-words sm:text-[46px] lg:text-[54px]">
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
                            <span className="mt-1 block text-[34px] leading-[1.08] sm:text-[56px] lg:text-[68px]">
                                <TypeText text={t.heroL3} delay={heroDelays[2]} speed={40} />
                            </span>
                        </h1>
                        <p className="m3-rise mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-[#b9b9bf] sm:mt-6.5 sm:text-[16px]" style={{ animationDelay: `${heroDoneSec}s` }}>{t.heroSub1}<br />{t.heroSub2}</p>
                        <div className="m3-rise mt-6 sm:mt-8" style={{ animationDelay: `${heroDoneSec + 0.1}s` }}>
                            <a href="#products" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md bg-[#ec3013] px-6 py-3 text-[12px] font-extrabold tracking-[0.1em] text-white uppercase no-underline hover:bg-[#ae1800] sm:px-7.5 sm:py-3.5 sm:text-[12.5px]">
                                {t.heroCta}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="m3-rise relative min-h-[42vh] overflow-hidden sm:min-h-[62vh] lg:hidden" style={{ animationDelay: '.2s' }}>
                        <img src="/images/hero/hero3.png" alt="M One Material printing facility" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg,#0b0b0c 0%,rgba(11,11,12,0) 28%),linear-gradient(0deg,rgba(11,11,12,.4) 0%,rgba(11,11,12,0) 28%)' }} />
                    </div>
                </div>

                {/* Hero stats — Years Experience / Printing Shops / Products / Delivery
                <div className="border-t border-[#232326]">
                    <div className="mx-auto grid max-w-[1600px] gap-6 px-5 py-7 md:px-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
                        {stats.map((s) => <CountStat key={s.label} {...s} />)}
                    </div>
                </div>
                */}
            </section>

            <section id="products" style={{ background: '#fafafa' }}>
                <div className="mx-auto max-w-[1600px] px-4 py-12 pb-14 sm:px-5 sm:py-18 sm:pb-21 md:px-12">
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="text-xs font-extrabold tracking-[0.14em] uppercase">{t.prodKicker}</Kicker>
                        <h2 className="m-0 mt-2.5 text-[24px] font-black tracking-tight break-words sm:text-[38px]">{t.prodTitle}</h2>
                    </div>
                    <div data-reveal role="tablist" className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
                        {TABS.map((c, i) => (
                            <button
                                key={c.en}
                                type="button"
                                role="tab"
                                onClick={() => { setCat(i); setTick((n) => n + 1); }}
                                className="cursor-pointer rounded whitespace-nowrap px-3.5 py-2 text-[12.5px] font-bold transition-colors sm:px-5 sm:py-2.5 sm:text-[13.5px]"
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
                        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,230px),1fr))' }}>
                            {products.map((p) => {
                                const name = lang === 'bm' ? p.nameBm : p.nameEn;
                                return (
                                <div key={p.nameEn} className="flex flex-col overflow-hidden rounded-md bg-white transition-all hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,.1)]">
                                    <img src={p.image} alt={name} loading="lazy" decoding="async" className="aspect-[4/3] w-full bg-white object-contain" />
                                    <div className="flex flex-1 flex-col gap-1 border-t border-[#f0f0f1] px-5 pt-4.5 pb-5">
                                        <p className="m-0 text-[16px] leading-tight font-extrabold">{name}</p>
                                        {p.spec && <p className="m-0 text-[13.5px] text-[#71717a]">{p.spec}</p>}
                                        <button
                                            type="button"
                                            onClick={() => openWaPicker(p)}
                                            className="mt-auto inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 pt-3.5 text-xs font-extrabold tracking-[0.08em] uppercase hover:opacity-80"
                                            style={{ color: ACCENT }}
                                        >
                                            {t.viewDetails}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="min-h-screen bg-white">
                <div className="grid min-h-screen items-stretch lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                    <div data-reveal className="ml-auto flex w-full max-w-[560px] min-w-0 flex-col justify-center self-center px-4 py-12 sm:px-5 sm:py-14 md:py-22 md:pr-6 md:pl-12">
                        <Kicker gradient={KICKER_GRADIENT} className="text-[13px] font-extrabold tracking-[0.14em] uppercase sm:text-[14px]">{t.aboutKicker}</Kicker>
                        <h2 className="m-0 mt-4 text-[28px] leading-tight font-black tracking-tight break-words sm:text-[48px] lg:text-[54px]">
                            {t.aboutTitle.split(t.aboutShine).map((part, i, parts) => {
                                const accented = t.aboutAccent && part.includes(t.aboutAccent)
                                    ? part.split(t.aboutAccent).map((chunk, j, chunks) => (
                                        <span key={`${chunk}-${j}`}>
                                            {chunk}
                                            {j < chunks.length - 1 ? <span style={{ color: ACCENT }}>{t.aboutAccent}</span> : null}
                                        </span>
                                    ))
                                    : part;
                                return (
                                    <span key={`${part}-${i}`}>
                                        {accented}
                                        {i < parts.length - 1 ? <ShineChars text={t.aboutShine} /> : null}
                                    </span>
                                );
                            })}
                        </h2>
                        <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.8] text-[#52525b] sm:mt-6 sm:text-[18px]">{t.aboutCopy1}</p>
                        <div className="mt-7 sm:mt-8">
                            <a href="#why" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-md border-[1.5px] border-[#ec3013] px-6 py-3 text-[12.5px] font-extrabold tracking-[0.1em] text-[#ec3013] uppercase no-underline hover:bg-[#ec3013] hover:text-white sm:px-8 sm:py-3.5 sm:text-[13.5px]">
                                {t.learnMore}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="relative min-h-[42vh] sm:min-h-[50vh] lg:min-h-full">
                        <img src="/images/about-us/aboutUs.png" alt="M One Material warehouse" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-left" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0) 18%)' }} />
                    </div>
                </div>
            </section>

            <section id="why" ref={whySectionRef}>
                <WhyScrollStory copy={t.whyStory} countFrom={10} autoMode={isAutoMode} />
            </section>

            <section id="contact" ref={contactSectionRef} className="relative min-h-screen overflow-hidden bg-white">
                <svg width="0" height="0" className="absolute" aria-hidden>
                    <defs>
                        <clipPath id="m3-contact-curve" clipPathUnits="objectBoundingBox">
                            {/* "/" curve: wider at top, soft S-curve into the white side */}
                            <path d="M0,0 H0.70 C0.62,0.28 0.68,0.72 0.54,1 H0 Z" />
                        </clipPath>
                    </defs>
                </svg>

                <div
                    className="absolute inset-0 z-0 max-lg:[clip-path:none] lg:[clip-path:url(#m3-contact-curve)]"
                >
                    <video
                        ref={contactVideoRef}
                        src="/video/contact-us.mp4"
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Warehouse location"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(115deg, rgba(11,11,12,.82) 0%, rgba(11,11,12,.55) 55%, rgba(11,11,12,.4) 100%)' }}
                    />
                </div>

                <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] items-center gap-8 px-4 py-12 sm:gap-12 sm:px-5 sm:py-16 md:px-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
                    <div data-reveal className="max-w-[640px] min-w-0 text-white lg:pl-4 xl:pl-6">
                        <Kicker gradient={KICKER_GRADIENT} className="text-[13px] font-extrabold tracking-[0.14em] uppercase sm:text-[14px]">{t.contactKicker}</Kicker>
                        <h2 className="m-0 mt-4 text-[32px] font-black tracking-tight break-words sm:text-[56px]">{t.contactTitle}</h2>
                        <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.75] text-white/85 sm:mt-5 sm:text-[18px]">{t.contactCopy}</p>

                        <div className="mt-8 grid grid-cols-1 gap-7 sm:mt-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
                            {CONTACTS.map((contact) => (
                                <div key={contact.email} className="flex min-w-0 items-start gap-3.5 sm:gap-5">
                                    <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#ec3013]/35 bg-white sm:h-14 sm:w-14" style={{ color: ACCENT }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </span>
                                    <div className="min-w-0">
                                        <p className="m-0 text-[17px] font-extrabold sm:text-[20px]">{contact.name}</p>
                                        <p className="m-0 mt-1 text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase sm:text-[12px]">{contact.role}</p>
                                        <div className="mt-2.5 grid gap-1.5 text-[14px] leading-[1.55] sm:mt-3 sm:text-[16px]">
                                            <a href={toWhatsAppHref(contact.phone)} target="_blank" rel="noopener noreferrer" className="text-white no-underline hover:text-white/80">{formatPhoneDisplay(contact.phone)}</a>
                                            <a href={`mailto:${contact.email}`} className="break-all text-white/80 no-underline hover:text-white">{contact.email}</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex min-w-0 items-start gap-3.5 sm:col-span-2 sm:gap-5 lg:col-span-1">
                                <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#ec3013]/35 bg-white sm:h-14 sm:w-14" style={{ color: ACCENT }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="m-0 text-[15px] leading-[1.55] font-semibold sm:text-[17px]">{t.address}</p>
                                    <p className="m-0 mt-2 text-[13px] text-white/75 sm:text-[15px]">{t.hours}</p>
                                    <p className="m-0 mt-1 text-[13px] text-white/75 sm:text-[15px]">{t.emailReply}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div data-reveal className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[440px] rounded-2xl bg-white p-7 text-center shadow-[0_24px_60px_rgba(0,0,0,.14)] sm:p-10 md:p-12">
                            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full text-white sm:h-20 sm:w-20" style={{ background: ACCENT }}>
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </span>
                            <h3 className="m-0 mt-5 text-[22px] font-extrabold tracking-tight break-words text-[#161616] sm:mt-6 sm:text-[26px]">{t.waCardTitle}</h3>
                            <p className="mt-3 text-[15px] leading-[1.65] text-[#71717a] sm:text-[16px]">{t.waCardCopy}</p>
                            <button
                                type="button"
                                onClick={() => openWaPicker()}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-lg px-5 py-3.5 text-[14px] font-extrabold tracking-[0.08em] text-white uppercase no-underline hover:opacity-90 sm:mt-8 sm:px-6 sm:py-4 sm:text-[15px]"
                                style={{ background: ACCENT }}
                            >
                                {t.waBtn}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-black text-[#9b9b9f]">
                <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-4 pt-10 pb-8 sm:grid-cols-2 sm:gap-10 sm:px-5 sm:pt-13 sm:pb-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)] md:gap-12 md:px-12">
                    <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                        <img src="/images/m-one-logo-black.png" alt="M One Material" loading="lazy" decoding="async" className="h-14 w-auto max-w-full md:h-[4.5rem]" />
                        <p className="mt-4 text-[13px] leading-[1.75] break-words sm:text-[14px]">
                            {t.footerBrand}<br />
                            {t.footerSsm}<br />
                            {t.rights}
                        </p>
                        <p className="mt-3 max-w-[36ch] text-[13px] leading-[1.65] sm:text-[14px]">{t.footerNote}</p>
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
                            <a href="#contact" className="text-[13.5px] text-[#9b9b9f] no-underline hover:text-white">{t.navContact}</a>
                        </div>
                    </div>
                    <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                        <p className="m-0 mb-3 text-[13px] font-extrabold text-white">{t.fSupport}</p>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 text-[13.5px] leading-snug min-[420px]:grid-cols-2">
                            {CONTACTS.map((contact) => (
                                <div key={contact.email} className="grid gap-0.5 min-w-0">
                                    <p className="m-0 font-semibold text-white">{contact.name}</p>
                                    <p className="m-0 text-[12px] uppercase tracking-[0.08em] text-[#9b9b9f]">{contact.role}</p>
                                    <a href={toWhatsAppHref(contact.phone)} target="_blank" rel="noopener noreferrer" className="text-[#9b9b9f] no-underline hover:text-white">{formatPhoneDisplay(contact.phone)}</a>
                                    <a href={`mailto:${contact.email}`} className="break-all text-[#9b9b9f] no-underline hover:text-white">{contact.email}</a>
                                </div>
                            ))}
                            <div className="grid gap-1.5 self-start min-w-0">
                                <span>{t.hours}</span>
                                <p className="m-0 text-[13px] leading-[1.55]">{t.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <button
                type="button"
                onClick={toggleAutoMode}
                aria-pressed={isAutoMode}
                aria-label={isAutoMode ? t.autoModeOff : t.autoModeOn}
                title={isAutoMode ? t.autoModeOff : t.autoModeOn}
                className="fixed right-4 bottom-4 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full border shadow-[0_18px_40px_rgba(0,0,0,.18)] transition-colors sm:right-5 sm:bottom-5 sm:h-14 sm:w-14"
                style={{
                    borderColor: isAutoMode ? ACCENT : '#d4d4d8',
                    background: isAutoMode ? ACCENT : '#fff',
                    color: isAutoMode ? '#fff' : '#52525b',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {isAutoMode ? (
                        <>
                            <rect x="6.5" y="5.5" width="4" height="13" rx="1" fill="currentColor" stroke="none" />
                            <rect x="13.5" y="5.5" width="4" height="13" rx="1" fill="currentColor" stroke="none" />
                        </>
                    ) : (
                        <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" stroke="none" />
                    )}
                </svg>
            </button>
            {isWaPickerOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain bg-[rgba(11,11,12,0.58)] px-3 py-4 sm:items-center sm:px-5 sm:py-8"
                    onClick={closeWaPicker}
                >
                    <div
                        className="relative my-auto flex max-h-[min(92dvh,720px)] w-full max-w-[460px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:rounded-[28px]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeWaPicker}
                            aria-label={t.waChooseClose}
                            className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ececee] bg-white text-[#71717a] hover:border-[#ec3013] hover:text-[#ec3013] sm:top-4 sm:right-4 sm:h-10 sm:w-10"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6 md:px-7 md:pt-7 md:pb-7">
                            <p className="m-0 pr-10 text-[11px] font-extrabold tracking-[0.14em] text-[#ec3013] uppercase sm:text-[12px]">{t.waChoosePrompt}</p>
                            <h3 className="m-0 mt-2 pr-10 text-[20px] leading-tight font-black tracking-tight break-words text-[#161616] sm:mt-3 sm:text-[28px]">{t.waCardTitle}</h3>
                            <p className="m-0 mt-2 max-w-[34ch] text-[14px] leading-[1.7] text-[#71717a] sm:mt-3 sm:text-[15px]">{t.waChooseCopy}</p>
                            {waPickerProduct && (
                                <p className="m-0 mt-3 rounded-xl bg-[#fafafa] px-3 py-2.5 text-[13px] leading-[1.5] break-words text-[#52525b] sm:px-3.5 sm:text-[13.5px]">
                                    <span className="font-extrabold text-[#161616]">{lang === 'bm' ? waPickerProduct.nameBm : waPickerProduct.nameEn}</span>
                                    {waPickerProduct.spec ? ` · ${waPickerProduct.spec}` : ''}
                                </p>
                            )}
                            <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
                                {CONTACTS.map((contact) => (
                                    <a
                                        key={contact.email}
                                        href={toWhatsAppHref(contact.phone, waPickerMessage)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={closeWaPicker}
                                        className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] px-3.5 py-3 no-underline transition-transform hover:-translate-y-0.5 hover:border-[#ec3013] hover:bg-white sm:px-4 sm:py-3.5"
                                    >
                                        <p className="m-0 text-[14px] font-extrabold text-[#161616] sm:text-[15px]">{contact.name}</p>
                                        <p className="m-0 mt-1 text-[10px] font-bold tracking-[0.12em] text-[#71717a] uppercase sm:text-[11px]">{contact.role}</p>
                                        <p className="m-0 mt-2 text-[13px] font-semibold sm:text-[14px]" style={{ color: ACCENT }}>{formatPhoneDisplay(contact.phone)}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
