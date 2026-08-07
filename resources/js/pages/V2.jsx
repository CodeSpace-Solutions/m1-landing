import { useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '../data/paperCatalog';
import Placeholder from '../components/Placeholder';
import TypeText from '../components/TypeText';
import TypeAccentLine from '../components/TypeAccentLine';
import Kicker from '../components/Kicker';
import WordRoller from '../components/WordRoller';
import MorphBadge from '../components/MorphBadge';
import CountNumber from '../components/CountNumber';
import { typeDelays } from '../lib/typeDelays';
import { useScrollReveal } from '../lib/useScrollReveal';

const KICKER_GRADIENT = 'linear-gradient(90deg, #1d4ed8 0%, #1d4ed8 42%, #8fb2ff 50%, #1d4ed8 58%, #1d4ed8 100%)';

const WHATSAPP = '+60 12-345 6789';
const WA_HREF = 'https://wa.me/' + WHATSAPP.replace(/[^0-9]/g, '');
const BLUE = '#1d4ed8';
const BLUE_DARK = '#1741ad';

const ICONS = [
    ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
    ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
    ['m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z', 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65', 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65'],
];

function Icon({ paths, size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
}

const T = {
    en: {
        navProducts: 'Products', navAbout: 'About', navWhy: 'Why M1', navContact: 'Contact', navCta: 'Get a quote',
        heroBadge: 'Wholesale printing materials · Malaysia',
        heroL1: 'The best value.', heroL2: 'In Malaysia.',
        heroSub: 'M1 supplies the materials your printing shop runs on — copier paper, photo media, banner rolls, sticker stock and finishing — at wholesale prices, delivered nationwide.',
        heroBrowse: 'Browse products', heroWa: 'WhatsApp us', heroChip: 'Quality checked before delivery',
        stat1: 'Printing shops supplied', stat2: 'Products listed', stat3: 'Delivery in Klang Valley',
        prodKicker: 'Products', prodTitle: 'Everything your shop runs on', enquire: 'Enquire',
        aboutKicker: 'About us', aboutTitle: 'Built for printing shops',
        aboutCopy1: 'M1 is a materials supplier, not a middleman. We stock the paper, media and finishing your presses and large-format printers actually run — tested on the machines our customers use, warehoused in Malaysia, and delivered on a schedule you can plan a job around.',
        aboutCopy2: 'One account, one delivery, every material. That is the whole idea.',
        whyKicker: 'Why choose us', whyTitle: 'Why shops buy from M1',
        why: [
            { title: 'Lowest price in Malaysia', copy: 'We buy at volume and sell at wholesale. Find the same material quoted lower and we will match it — that is the standing offer.' },
            { title: 'Quality guarantee', copy: 'Every ream and roll is checked before it ships. Jams, ghosting or coating defects — we replace the batch. No forms, no argument.' },
            { title: 'Bulk & wholesale discounts', copy: 'Tiered pricing that improves as your volume grows. Standing orders lock your rate for the year.' },
        ],
        closeL1: 'One supplier.', closeL2: 'Every material.', closeSub: 'Tell us what your shop prints and we will quote the full list — usually within the hour.', closeBtn: 'WhatsApp us now',
        deliverPrefix: 'We deliver on your', deliverWords: ['schedule.', 'terms.', 'budget.', 'timeline.', 'schedule.'],
        morphQ: 'No markup?', morphA: 'fair!',
        contactKicker: 'Contact', contactTitle: 'Talk to us',
        contactCopy: 'Call, WhatsApp or send an enquiry — we reply within the working day.',
        lPhone: 'Phone', lEmail: 'Email', lAddr: 'Address', formTitle: 'Send an enquiry',
        fName: 'Name', fShop: 'Shop / company', fPhoneEmail: 'Phone or email', fMsg: 'What do you need?',
        fSend: 'Send enquiry', fSent: 'Sent — we will be in touch',
        footerNote: 'Wholesale printing materials, delivered nationwide.',
    },
    bm: {
        navProducts: 'Produk', navAbout: 'Tentang', navWhy: 'Kenapa M1', navContact: 'Hubungi', navCta: 'Minta sebut harga',
        heroBadge: 'Bahan cetakan borong · Malaysia',
        heroL1: 'Nilai terbaik.', heroL2: 'Di Malaysia.',
        heroSub: 'M1 membekalkan bahan yang kedai cetak anda perlukan — kertas fotostat, media foto, gulungan banner, stok pelekat dan kemasan — pada harga borong, dihantar ke seluruh negara.',
        heroBrowse: 'Lihat produk', heroWa: 'WhatsApp kami', heroChip: 'Kualiti diperiksa sebelum penghantaran',
        stat1: 'Kedai cetak dibekalkan', stat2: 'Produk disenaraikan', stat3: 'Penghantaran Lembah Klang',
        prodKicker: 'Produk', prodTitle: 'Semua yang kedai anda perlukan', enquire: 'Tanya',
        aboutKicker: 'Tentang kami', aboutTitle: 'Dibina untuk kedai cetak',
        aboutCopy1: 'M1 ialah pembekal bahan, bukan orang tengah. Kami menyimpan kertas, media dan kemasan yang benar-benar digunakan oleh mesin cetak anda — diuji, disimpan di Malaysia, dan dihantar mengikut jadual yang boleh anda rancang.',
        aboutCopy2: 'Satu akaun, satu penghantaran, semua bahan. Itulah idea kami.',
        whyKicker: 'Kenapa pilih kami', whyTitle: 'Kenapa kedai memilih M1',
        why: [
            { title: 'Harga terendah di Malaysia', copy: 'Kami beli secara pukal dan jual pada harga borong. Jumpa bahan sama dengan harga lebih rendah? Kami padankan.' },
            { title: 'Jaminan kualiti', copy: 'Setiap rim dan gulungan diperiksa sebelum dihantar. Kecacatan salutan atau cetakan — kami ganti. Tanpa borang, tanpa soal.' },
            { title: 'Diskaun pukal & borong', copy: 'Harga bertingkat yang semakin baik apabila volum anda meningkat. Pesanan tetap mengunci harga anda untuk setahun.' },
        ],
        closeL1: 'Satu pembekal.', closeL2: 'Semua bahan.', closeSub: 'Beritahu kami apa yang kedai anda cetak dan kami akan sebut harga senarai penuh — biasanya dalam masa sejam.', closeBtn: 'WhatsApp kami sekarang',
        deliverPrefix: 'Kami hantar mengikut', deliverWords: ['jadual.', 'terma.', 'bajet.', 'garis masa.', 'jadual.'],
        morphQ: 'Tiada markup?', morphA: 'adil!',
        contactKicker: 'Hubungi', contactTitle: 'Hubungi kami',
        contactCopy: 'Telefon, WhatsApp atau hantar pertanyaan — kami balas dalam hari bekerja yang sama.',
        lPhone: 'Telefon', lEmail: 'E-mel', lAddr: 'Alamat', formTitle: 'Hantar pertanyaan',
        fName: 'Nama', fShop: 'Kedai / syarikat', fPhoneEmail: 'Telefon atau e-mel', fMsg: 'Apa yang anda perlukan?',
        fSend: 'Hantar pertanyaan', fSent: 'Dihantar — kami akan hubungi anda',
        footerNote: 'Bahan cetakan borong, dihantar ke seluruh negara.',
    },
};

export default function V2() {
    const [lang, setLang] = useState('en');
    const [cat, setCat] = useState(0);
    const [sent, setSent] = useState(false);
    const scopeRef = useRef(null);
    useScrollReveal(scopeRef);

    const t = T[lang];
    const products = useMemo(
        () => {
            const category = CATEGORIES[cat];
            return category.items.map(([name, spec], i) => ({
                name,
                spec,
                image: `/images/products/${category.imageFolder}/${String(i + 1).padStart(2, '0')}.png?v=logo-fixed-v2-4x3`,
                id: `v2-p-${cat}-${i}`,
            }));
        },
        [cat],
    );
    const heroDelays = useMemo(() => typeDelays([t.heroL1, t.heroL2], 42, 180, 120), [t.heroL1, t.heroL2]);
    const heroDoneSec = (heroDelays[1] + t.heroL2.length * 42 + 200) / 1000;

    return (
        <div ref={scopeRef}>
            <nav className="sticky top-0 z-50 border-b border-[#e8edf6] bg-white/92 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-3.5 md:gap-8 md:px-12">
                    <img src="/images/m-one-logo.png" alt="M One Material" className="h-10 w-auto" />
                    <div className="ml-auto flex flex-wrap items-center gap-4 md:gap-7">
                        <a href="#products" className="hidden text-[14.5px] font-semibold text-[#3d4d68] no-underline hover:text-[#1d4ed8] sm:inline">{t.navProducts}</a>
                        <a href="#about" className="hidden text-[14.5px] font-semibold text-[#3d4d68] no-underline hover:text-[#1d4ed8] sm:inline">{t.navAbout}</a>
                        <a href="#why" className="hidden text-[14.5px] font-semibold text-[#3d4d68] no-underline hover:text-[#1d4ed8] sm:inline">{t.navWhy}</a>
                        <a href="#contact" className="hidden text-[14.5px] font-semibold text-[#3d4d68] no-underline hover:text-[#1d4ed8] sm:inline">{t.navContact}</a>
                        <span className="inline-flex items-center gap-0.5">
                            <button type="button" onClick={() => setLang('en')} className="p-1 text-[13px] font-bold" style={{ color: lang === 'en' ? BLUE : '#8595ad' }}>EN</button>
                            <span className="text-[13px] text-[#b6c2d6]">/</span>
                            <button type="button" onClick={() => setLang('bm')} className="p-1 text-[13px] font-bold" style={{ color: lang === 'bm' ? BLUE : '#8595ad' }}>BM</button>
                        </span>
                        <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-full px-5.5 py-2.5 text-[14.5px] font-bold text-white no-underline shadow-[0_6px_18px_rgba(29,78,216,.28)]" style={{ background: BLUE }}>
                            {t.navCta}
                        </a>
                    </div>
                </div>
            </nav>

            <section style={{ background: 'linear-gradient(180deg,#f4f8ff 0%,#ffffff 88%)' }}>
                <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-14 pb-18 md:px-12 md:py-24 lg:grid-cols-2 lg:gap-20">
                    <div key={lang}>
                        <span className="m2-rise inline-block rounded-full bg-[#e5eeff] px-4 py-1.5 text-[13px] font-bold text-[#1741ad]">{t.heroBadge}</span>
                        <h1 className="mt-5 text-[38px] leading-[1.08] font-extrabold tracking-tight sm:text-[50px] lg:text-[62px]">
                            <TypeText text={t.heroL1} delay={heroDelays[0]} /><br />
                            <TypeAccentLine text={t.heroL2} delay={heroDelays[1]} accent={BLUE} from="#9aa7c2" />
                        </h1>
                        <p className="m2-rise mt-5 max-w-[54ch] text-[17px] leading-[1.7] text-[#4c5d7a]" style={{ animationDelay: `${heroDoneSec}s` }}>{t.heroSub}</p>
                        <div className="m2-rise mt-8 flex flex-wrap gap-3.5" style={{ animationDelay: `${heroDoneSec + 0.08}s` }}>
                            <a href="#products" className="whitespace-nowrap rounded-full px-7 py-3.5 text-[15.5px] font-bold text-white no-underline shadow-[0_8px_24px_rgba(29,78,216,.3)]" style={{ background: BLUE }}>{t.heroBrowse}</a>
                            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-full border-[1.5px] border-[#dbe3f0] px-7 py-3.5 text-[15.5px] font-bold text-[#12203a] no-underline hover:border-[#1d4ed8] hover:text-[#1d4ed8]">{t.heroWa}</a>
                        </div>
                        <div className="m2-rise mt-11 flex flex-wrap gap-6 sm:gap-11" style={{ animationDelay: `${heroDoneSec + 0.16}s` }}>
                            {[[500, '+', t.stat1], [49, '', t.stat2], [24, 'h', t.stat3]].map(([target, suffix, l]) => (
                                <div key={l}>
                                    <p className="m-0 text-[26px] font-extrabold">
                                        <CountNumber target={target} suffix={suffix} from={BLUE} to="#12203a" delay={heroDoneSec + 0.16} />
                                    </p>
                                    <p className="mt-1 text-[13.5px] text-[#64748f]">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="m2-rise relative" style={{ animationDelay: '.2s' }}>
                        <Placeholder label="Hero photo — warehouse / paper rolls" className="rounded-3xl shadow-[0_24px_60px_rgba(16,42,90,.16)]" style={{ aspectRatio: '5/4' }} />
                        <div className="m2-float absolute -left-4.5 bottom-6 flex items-center gap-3 rounded-2xl bg-white px-4.5 py-3.5 shadow-[0_12px_32px_rgba(16,42,90,.14)]">
                            <span className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#e5eeff]" style={{ color: BLUE }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                            </span>
                            <span className="text-sm font-bold text-[#12203a]">{t.heroChip}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="products" className="mx-auto max-w-[1200px] px-5 py-14 pb-22 md:px-12">
                <div data-reveal className="mx-auto max-w-[640px] text-center">
                    <Kicker gradient={KICKER_GRADIENT} className="text-[13.5px] font-bold tracking-[0.08em] uppercase">{t.prodKicker}</Kicker>
                    <h2 className="m-0 mt-3 text-[28px] font-extrabold tracking-tight sm:text-[42px]">{t.prodTitle}</h2>
                </div>
                <div data-reveal className="my-9 flex justify-center">
                    <div role="tablist" className="inline-flex flex-wrap justify-center gap-1.5 rounded-full bg-[#f1f5fb] p-1.5">
                        {CATEGORIES.map((c, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                onClick={() => setCat(i)}
                                className="cursor-pointer rounded-full px-4.5 py-2.5 text-[13.5px] font-bold whitespace-nowrap transition-colors"
                                style={{
                                    background: i === cat ? BLUE : 'transparent',
                                    color: i === cat ? '#fff' : '#4c5d7a',
                                    boxShadow: i === cat ? '0 6px 16px rgba(29,78,216,.3)' : 'none',
                                }}
                            >
                                {c[lang]}
                            </button>
                        ))}
                    </div>
                </div>
                <div data-reveal className="grid gap-5.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                    {products.map((p) => (
                        <div key={p.id} className="flex flex-col overflow-hidden rounded-[18px] border border-[#e8edf6] bg-white transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,42,90,.12)]">
                            <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/3] w-full bg-white object-contain" />
                            <div className="flex flex-1 flex-col gap-1.5 px-5 pt-4.5 pb-5">
                                <p className="m-0 text-[15.5px] leading-tight font-bold">{p.name}</p>
                                {p.spec && <p className="m-0 text-[13px] text-[#64748f]">{p.spec}</p>}
                                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-auto pt-2.5 text-[13.5px] font-bold no-underline hover:text-[#1741ad]" style={{ color: BLUE }}>{t.enquire} &#8594;</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="about" className="bg-[#f6f9ff]">
                <div className="mx-auto grid max-w-[1200px] items-center gap-11 px-5 py-20 md:px-12 lg:grid-cols-2 lg:gap-22">
                    <Placeholder data-reveal label="Warehouse / team photograph" className="rounded-3xl shadow-[0_20px_50px_rgba(16,42,90,.12)]" style={{ aspectRatio: '951/665' }} />
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="text-[13.5px] font-bold tracking-[0.08em] uppercase">{t.aboutKicker}</Kicker>
                        <h2 className="m-0 mt-3 text-[26px] font-extrabold tracking-tight sm:text-[38px]">{t.aboutTitle}</h2>
                        <p className="mt-5 max-w-[54ch] text-[15.5px] leading-[1.8] text-[#4c5d7a]">{t.aboutCopy1}</p>
                        <p className="mt-3.5 max-w-[54ch] text-[15.5px] leading-[1.8] font-semibold text-[#4c5d7a]">{t.aboutCopy2}</p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-5 py-12 text-center md:px-12 md:py-16">
                <p className="m-0 text-[22px] leading-snug font-extrabold tracking-tight sm:text-[30px]">
                    {t.deliverPrefix}{' '}
                    <WordRoller words={t.deliverWords} className="min-w-[7ch]" itemClassName="text-left" style={{ color: BLUE }} />
                </p>
            </section>

            <section id="why" className="mx-auto max-w-[1200px] px-5 py-21 md:px-12">
                <div data-reveal className="mx-auto mb-11 max-w-[640px] text-center">
                    <Kicker gradient={KICKER_GRADIENT} className="text-[13.5px] font-bold tracking-[0.08em] uppercase">{t.whyKicker}</Kicker>
                    <h2 className="m-0 mt-3 text-[28px] font-extrabold tracking-tight sm:text-[42px]">{t.whyTitle}</h2>
                </div>
                <div className="grid gap-5.5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
                    {t.why.map((w, i) => (
                        <div key={w.title} data-reveal className="rounded-[20px] border border-[#e8edf6] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,42,90,.1)]">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#e5eeff]" style={{ color: BLUE }}>
                                <Icon paths={ICONS[i]} />
                            </span>
                            <h3 className="mt-4.5 text-[19px] font-bold tracking-tight">{w.title}</h3>
                            <p className="mt-2.5 text-[14.5px] leading-[1.75] text-[#4c5d7a]">{w.copy}</p>
                            {i === 0 && (
                                <p className="mt-3 text-[14.5px] font-bold">
                                    <MorphBadge question={t.morphQ} answer={t.morphA} />
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-5 md:px-12">
                <div data-reveal className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] p-9 shadow-[0_24px_60px_rgba(13,42,107,.3)] md:p-16" style={{ background: 'linear-gradient(120deg,#0d2a6b 0%,#1d4ed8 100%)' }}>
                    <div>
                        <h3 className="m-0 text-[26px] leading-tight font-extrabold tracking-tight text-white sm:text-[42px]">{t.closeL1} {t.closeL2}</h3>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.7] text-white/78">{t.closeSub}</p>
                    </div>
                    <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-full bg-white px-7.5 py-4 text-[15.5px] font-extrabold text-[#12306e] no-underline shadow-[0_10px_26px_rgba(0,0,0,.2)] hover:bg-[#e5eeff]">
                        {t.closeBtn}
                    </a>
                </div>
            </section>

            <section id="contact" className="mx-auto grid max-w-[1200px] gap-12 px-5 py-21 pb-18 md:px-12 lg:grid-cols-2 lg:gap-22">
                <div data-reveal>
                    <Kicker gradient={KICKER_GRADIENT} className="text-[13.5px] font-bold tracking-[0.08em] uppercase">{t.contactKicker}</Kicker>
                    <h2 className="m-0 mt-3 text-[26px] font-extrabold tracking-tight sm:text-[38px]">{t.contactTitle}</h2>
                    <p className="mt-4.5 mb-7 max-w-[48ch] text-[15.5px] leading-[1.8] text-[#4c5d7a]">{t.contactCopy}</p>
                    <div className="grid gap-4">
                        <ContactRow label={t.lPhone} value="+60 3-8060 1234" paths={['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z']} />
                        <ContactRow label={t.lEmail} value="sales@m1supplies.my" paths={['M2 4h20v16H2z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7']} />
                        <ContactRow label={t.lAddr} value={<>Lot 12, Jalan Industri 3, 47100 Puchong, Selangor</>} paths={['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0']} />
                    </div>
                    <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block whitespace-nowrap rounded-full bg-[#22c05c] px-6.5 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_8px_22px_rgba(34,192,92,.3)] hover:bg-[#1ba550]">
                        {t.heroWa}
                    </a>
                    <Placeholder label="Map screenshot" className="mt-8 rounded-[18px] border border-[#e8edf6]" style={{ aspectRatio: '16/7' }} />
                </div>
                <form
                    data-reveal
                    onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                    className="grid h-fit content-start gap-4.5 rounded-3xl border border-[#e8edf6] bg-white p-7 shadow-[0_18px_48px_rgba(16,42,90,.08)] md:p-10"
                >
                    <h3 className="m-0 mb-1 text-xl font-bold">{t.formTitle}</h3>
                    <V2Field label={t.fName} id="v2-name" required />
                    <V2Field label={t.fShop} id="v2-shop" />
                    <V2Field label={t.fPhoneEmail} id="v2-mail" required />
                    <div className="grid gap-1.5">
                        <label htmlFor="v2-msg" className="text-[13.5px] font-bold text-[#3d4d68]">{t.fMsg}</label>
                        <textarea id="v2-msg" rows={5} className="rounded-xl border-[1.5px] border-[#dbe3f0] bg-[#fbfcfe] px-4 py-3 text-[15px] outline-none focus:border-[#1d4ed8] focus:bg-white" />
                    </div>
                    <button type="submit" className="whitespace-nowrap rounded-full px-7 py-3.5 text-[15.5px] font-bold text-white shadow-[0_8px_24px_rgba(29,78,216,.28)] hover:bg-[#1741ad]" style={{ background: BLUE }}>
                        {sent ? t.fSent : t.fSend}
                    </button>
                </form>
            </section>

            <footer className="border-t border-[#e8edf6]">
                <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-5 py-6.5 text-[13.5px] text-[#8595ad] md:px-12">
                    <span>© 2026 M1 Supplies Sdn Bhd</span>
                    <span>{t.footerNote}</span>
                </div>
            </footer>
        </div>
    );
}

function ContactRow({ label, value, paths }) {
    return (
        <div className="flex items-center gap-3.5">
            <span className="inline-flex h-10.5 w-10.5 flex-shrink-0 items-center justify-center rounded-xl bg-[#e5eeff]" style={{ color: BLUE }}>
                <Icon paths={paths} size={18} />
            </span>
            <div>
                <p className="m-0 text-xs font-bold tracking-[0.06em] text-[#8595ad] uppercase">{label}</p>
                <p className="mt-0.5 text-[15.5px] leading-normal font-semibold">{value}</p>
            </div>
        </div>
    );
}

function V2Field({ label, id, required }) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-[13.5px] font-bold text-[#3d4d68]">{label}</label>
            <input id={id} type="text" required={required} className="rounded-xl border-[1.5px] border-[#dbe3f0] bg-[#fbfcfe] px-4 py-3 text-[15px] outline-none focus:border-[#1d4ed8] focus:bg-white" />
        </div>
    );
}
