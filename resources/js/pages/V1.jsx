import { useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '../data/paperCatalog';
import Placeholder from '../components/Placeholder';
import TypeText from '../components/TypeText';
import TypeAccentLine from '../components/TypeAccentLine';
import Kicker from '../components/Kicker';
import WordRoller from '../components/WordRoller';
import MorphBadge from '../components/MorphBadge';
import { typeDelays } from '../lib/typeDelays';
import { useScrollReveal } from '../lib/useScrollReveal';

const WHATSAPP = '+60 12-345 6789';
const WA_HREF = 'https://wa.me/' + WHATSAPP.replace(/[^0-9]/g, '');

const T = {
    en: {
        navProducts: 'Products', navAbout: 'About', navWhy: 'Why M1', navContact: 'Contact', navCta: 'Get a quote',
        heroL1: 'The best value.', heroL2: 'In Malaysia.',
        heroSub: 'M1 supplies the materials your printing shop runs on — copier paper, photo media, banner rolls, sticker stock and finishing — at wholesale prices, delivered nationwide.',
        heroBrowse: 'Browse products', heroWa: 'WhatsApp us',
        prodKicker: 'Products', prodTitle: 'Everything your shop runs on.', enquire: 'Enquire',
        aboutKicker: 'About us', aboutTitle: 'Built for printing shops.',
        aboutCopy1: 'M1 is a materials supplier, not a middleman. We stock the paper, media and finishing your presses and large-format printers actually run — tested on the machines our customers use, warehoused in Malaysia, and delivered on a schedule you can plan a job around.',
        aboutCopy2: 'One account, one delivery, every material. That is the whole idea.',
        whyKicker: 'Why choose us',
        why: [
            { n: '01', title: 'Lowest price in Malaysia', copy: 'We buy at volume and sell at wholesale. Find the same material quoted lower and we will match it — that is the standing offer.' },
            { n: '02', title: 'Quality guarantee', copy: 'Every ream and roll is checked before it ships. Jams, ghosting or coating defects — we replace the batch. No forms, no argument.' },
            { n: '03', title: 'Bulk & wholesale discounts', copy: 'Tiered pricing that improves as your volume grows. Standing orders lock your rate for the year.' },
        ],
        closeL1: 'One supplier.', closeL2: 'Every material.', closeBtn: 'WhatsApp us now',
        deliverPrefix: 'We deliver on your', deliverWords: ['schedule.', 'terms.', 'budget.', 'timeline.', 'schedule.'],
        morphQ: 'No markup?', morphA: 'fair!',
        contactKicker: 'Contact', contactTitle: 'Talk to us.',
        contactCopy: 'Call, WhatsApp or send an enquiry — we reply within the working day.',
        lPhone: 'Phone', lEmail: 'Email', lAddr: 'Address',
        fName: 'Name', fShop: 'Shop / company', fPhoneEmail: 'Phone or email', fMsg: 'What do you need?',
        fSend: 'Send enquiry', fSent: 'Sent — we will be in touch',
        footerNote: 'Wholesale printing materials, delivered nationwide.',
    },
    bm: {
        navProducts: 'Produk', navAbout: 'Tentang', navWhy: 'Kenapa M1', navContact: 'Hubungi', navCta: 'Minta sebut harga',
        heroL1: 'Nilai terbaik.', heroL2: 'Di Malaysia.',
        heroSub: 'M1 membekalkan bahan yang kedai cetak anda perlukan — kertas fotostat, media foto, gulungan banner, stok pelekat dan kemasan — pada harga borong, dihantar ke seluruh negara.',
        heroBrowse: 'Lihat produk', heroWa: 'WhatsApp kami',
        prodKicker: 'Produk', prodTitle: 'Semua yang kedai anda perlukan.', enquire: 'Tanya',
        aboutKicker: 'Tentang kami', aboutTitle: 'Dibina untuk kedai cetak.',
        aboutCopy1: 'M1 ialah pembekal bahan, bukan orang tengah. Kami menyimpan kertas, media dan kemasan yang benar-benar digunakan oleh mesin cetak anda — diuji, disimpan di Malaysia, dan dihantar mengikut jadual yang boleh anda rancang.',
        aboutCopy2: 'Satu akaun, satu penghantaran, semua bahan. Itulah idea kami.',
        whyKicker: 'Kenapa pilih kami',
        why: [
            { n: '01', title: 'Harga terendah di Malaysia', copy: 'Kami beli secara pukal dan jual pada harga borong. Jumpa bahan sama dengan harga lebih rendah? Kami padankan.' },
            { n: '02', title: 'Jaminan kualiti', copy: 'Setiap rim dan gulungan diperiksa sebelum dihantar. Kecacatan salutan atau cetakan — kami ganti. Tanpa borang, tanpa soal.' },
            { n: '03', title: 'Diskaun pukal & borong', copy: 'Harga bertingkat yang semakin baik apabila volum anda meningkat. Pesanan tetap mengunci harga anda untuk setahun.' },
        ],
        closeL1: 'Satu pembekal.', closeL2: 'Semua bahan.', closeBtn: 'WhatsApp kami sekarang',
        deliverPrefix: 'Kami hantar mengikut', deliverWords: ['jadual.', 'terma.', 'bajet.', 'garis masa.', 'jadual.'],
        morphQ: 'Tiada markup?', morphA: 'adil!',
        contactKicker: 'Hubungi', contactTitle: 'Hubungi kami.',
        contactCopy: 'Telefon, WhatsApp atau hantar pertanyaan — kami balas dalam hari bekerja yang sama.',
        lPhone: 'Telefon', lEmail: 'E-mel', lAddr: 'Alamat',
        fName: 'Nama', fShop: 'Kedai / syarikat', fPhoneEmail: 'Telefon atau e-mel', fMsg: 'Apa yang anda perlukan?',
        fSend: 'Hantar pertanyaan', fSent: 'Dihantar — kami akan hubungi anda',
        footerNote: 'Bahan cetakan borong, dihantar ke seluruh negara.',
    },
};

const ACCENT = '#ec3013';
const ACCENT_700 = '#ae1800';
const ACCENT_600 = '#dd2b0f';
const KICKER_GRADIENT = `linear-gradient(90deg, ${ACCENT_700} 0%, ${ACCENT_700} 42%, ${ACCENT} 50%, ${ACCENT_700} 58%, ${ACCENT_700} 100%)`;

export default function V1() {
    const [lang, setLang] = useState('en');
    const [cat, setCat] = useState(0);
    const [sent, setSent] = useState(false);
    const scopeRef = useRef(null);
    useScrollReveal(scopeRef);

    const t = T[lang];
    const products = useMemo(
        () => CATEGORIES[cat].items.map(([name, spec], i) => ({ name, spec, id: `p-${cat}-${i}` })),
        [cat],
    );
    const heroDelays = useMemo(() => typeDelays([t.heroL1, t.heroL2]), [t.heroL1, t.heroL2]);
    const heroDoneSec = (heroDelays[1] + t.heroL2.length * 42 + 250) / 1000;

    return (
        <div ref={scopeRef}>
            <nav className="sticky top-0 z-50 flex items-center gap-4 border-b-2 border-[#201e1d]/40 bg-[#f3f2f2] px-6 py-3 md:px-12">
                <span className="mr-auto inline-flex items-center gap-2 font-extrabold text-lg">
                    M1<span className="inline-block h-2.5 w-2.5" style={{ background: ACCENT }} />
                </span>
                <a href="#products" className="hidden text-sm hover:text-[#ec3013] sm:inline">{t.navProducts}</a>
                <a href="#about" className="hidden text-sm hover:text-[#ec3013] sm:inline">{t.navAbout}</a>
                <a href="#why" className="hidden text-sm hover:text-[#ec3013] sm:inline">{t.navWhy}</a>
                <a href="#contact" className="hidden text-sm hover:text-[#ec3013] sm:inline">{t.navContact}</a>
                <span className="ml-2 inline-flex items-center gap-0.5">
                    <button type="button" onClick={() => setLang('en')} className="px-0.5 font-extrabold text-[13px]" style={{ color: lang === 'en' ? ACCENT : 'color-mix(in srgb, #201e1d 55%, transparent)' }}>EN</button>
                    <span className="text-[13px] text-[#201e1d]/40">/</span>
                    <button type="button" onClick={() => setLang('bm')} className="px-0.5 font-extrabold text-[13px]" style={{ color: lang === 'bm' ? ACCENT : 'color-mix(in srgb, #201e1d 55%, transparent)' }}>BM</button>
                </span>
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-4 py-2 text-sm font-extrabold text-[#f3f2f2] no-underline" style={{ background: ACCENT }}>
                    {t.navCta}
                </a>
            </nav>

            <div className="mx-auto max-w-[1200px] px-6 md:px-16">
                <section key={lang} className="py-18 md:py-28">
                    <h1 className="m-0 text-[44px] leading-[1.06] font-extrabold tracking-tight sm:text-[64px] lg:text-[84px]">
                        <span className="block"><TypeText text={t.heroL1} delay={heroDelays[0]} /></span>
                        <span className="block"><TypeAccentLine text={t.heroL2} delay={heroDelays[1]} accent={ACCENT} from="#8a8785" /></span>
                    </h1>
                    <p className="m1-rise mt-9 max-w-[58ch] text-[17px] leading-[1.65]" style={rise(heroDoneSec)}>{t.heroSub}</p>
                    <div className="m1-rise mt-8 flex flex-wrap gap-3" style={rise(heroDoneSec + 0.1)}>
                        <a href="#products" className="whitespace-nowrap px-5 py-3 text-sm font-extrabold text-[#f3f2f2] no-underline" style={{ background: ACCENT }}>{t.heroBrowse}</a>
                        <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-3 py-3 text-sm font-extrabold no-underline" style={{ color: ACCENT }}>{t.heroWa}</a>
                    </div>
                </section>

                <hr className="m-0 h-0.5 border-0 bg-[#201e1d]/40" />

                <section id="products" className="py-16 md:py-24">
                    <Kicker data-reveal gradient={KICKER_GRADIENT} className="mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">{t.prodKicker}</Kicker>
                    <h2 data-reveal className="m-0 text-[30px] font-extrabold tracking-tight sm:text-[44px]">{t.prodTitle}</h2>
                    <div role="tablist" className="mt-10 flex flex-wrap gap-6 border-b-2 border-[#201e1d]/40 sm:gap-10">
                        {CATEGORIES.map((c, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                onClick={() => setCat(i)}
                                className="-mb-0.5 cursor-pointer border-0 border-b-2 bg-transparent py-3.5 text-sm font-semibold tracking-wide uppercase"
                                style={{
                                    borderColor: i === cat ? ACCENT : 'transparent',
                                    color: i === cat ? ACCENT_700 : 'color-mix(in srgb, #201e1d 62%, transparent)',
                                }}
                            >
                                {c[lang]}
                            </button>
                        ))}
                    </div>
                    <div data-reveal className="mt-0.5 grid gap-0.5 border-2 border-t-0 border-[#201e1d]/40 bg-[#201e1d]/40" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))' }}>
                        {products.map((p) => (
                            <div key={p.id} className="flex flex-col gap-3.5 bg-[#f3f2f2] p-4 pb-5">
                                <Placeholder label="Product photo" className="w-full aspect-[4/3] grayscale" />
                                <div>
                                    <p className="m-0 text-[16px] leading-tight font-semibold">{p.name}</p>
                                    <p className="mt-1.5 text-[13px] leading-snug" style={{ color: 'color-mix(in srgb, #201e1d 70%, transparent)' }}>{p.spec}</p>
                                </div>
                                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-auto text-[13px] font-semibold tracking-[0.08em] uppercase no-underline" style={{ color: ACCENT_700 }}>
                                    {t.enquire} &#8594;
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="m-0 h-0.5 border-0 bg-[#201e1d]/40" />

                <section id="about" className="grid items-center gap-7 py-16 md:py-24 lg:grid-cols-2 lg:gap-24">
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">{t.aboutKicker}</Kicker>
                        <h2 className="m-0 text-[28px] font-extrabold tracking-tight sm:text-[40px]">{t.aboutTitle}</h2>
                        <p className="mt-6 max-w-[52ch] text-[15.5px] leading-[1.75]" style={{ color: 'color-mix(in srgb, #201e1d 78%, transparent)' }}>{t.aboutCopy1}</p>
                        <p className="mt-4 max-w-[52ch] text-[15.5px] leading-[1.75]" style={{ color: 'color-mix(in srgb, #201e1d 78%, transparent)' }}>{t.aboutCopy2}</p>
                    </div>
                    <Placeholder data-reveal label="Warehouse / stock photograph" className="grayscale" style={{ aspectRatio: '951/665' }} />
                </section>

                <hr className="m-0 h-0.5 border-0 bg-[#201e1d]/40" />

                <section className="py-14 text-center md:py-20">
                    <p className="m-0 text-[24px] leading-snug font-extrabold tracking-tight sm:text-[32px]">
                        {t.deliverPrefix}{' '}
                        <WordRoller
                            words={t.deliverWords}
                            className="min-w-[7ch]"
                            itemClassName="text-left"
                            style={{ color: ACCENT }}
                        />
                    </p>
                </section>

                <hr className="m-0 h-0.5 border-0 bg-[#201e1d]/40" />

                <section id="why" className="py-16 pb-14 md:py-24">
                    <Kicker data-reveal gradient={KICKER_GRADIENT} className="mb-10 block text-[13px] font-semibold tracking-[0.08em] uppercase">{t.whyKicker}</Kicker>
                    {t.why.map((w) => (
                        <div key={w.n} data-reveal className="grid grid-cols-[minmax(64px,160px)_minmax(0,1fr)] items-baseline gap-3.5 border-t-2 border-[#201e1d]/40 py-9" style={{ columnGap: 'clamp(24px,4vw,72px)' }}>
                            <p className="relative m-0 text-[15px] font-extrabold">
                                {w.n}
                                <span className="absolute -left-6 top-1 h-2.5 w-2.5" style={{ background: ACCENT }} />
                            </p>
                            <div>
                                <h3 className="m-0 text-[24px] leading-tight font-extrabold tracking-tight">{w.title}</h3>
                                <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.75]" style={{ color: 'color-mix(in srgb, #201e1d 78%, transparent)' }}>{w.copy}</p>
                                {w.n === '01' && (
                                    <p className="mt-3 text-[15px] font-bold">
                                        <MorphBadge question={t.morphQ} answer={t.morphA} />
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            <section style={{ background: ACCENT, color: '#f3f2f2' }}>
                <div data-reveal className="mx-auto max-w-[1200px] px-6 py-16 md:px-16 md:py-24">
                    <h3 className="m-0 text-[34px] leading-[1.06] font-extrabold tracking-tight sm:text-[56px]">
                        <span className="block">{t.closeL1}</span>
                        <span className="block">{t.closeL2}</span>
                    </h3>
                    <div className="mt-10">
                        <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap border border-current px-5 py-3 text-sm font-extrabold no-underline">
                            {t.closeBtn}
                        </a>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1200px] px-6 md:px-16">
                <section id="contact" className="grid gap-14 py-16 md:py-24 lg:grid-cols-2" style={{ columnGap: 'clamp(32px,6vw,110px)' }}>
                    <div data-reveal>
                        <Kicker gradient={KICKER_GRADIENT} className="mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">{t.contactKicker}</Kicker>
                        <h2 className="m-0 text-[28px] font-extrabold tracking-tight sm:text-[40px]">{t.contactTitle}</h2>
                        <p className="mt-6 mb-8 max-w-[48ch] text-[15.5px] leading-[1.75]" style={{ color: 'color-mix(in srgb, #201e1d 78%, transparent)' }}>{t.contactCopy}</p>
                        <div className="grid gap-5 border-t-2 border-[#201e1d]/40 pt-7">
                            <div>
                                <p className="m-0 mb-1 text-xs tracking-[0.08em] uppercase" style={{ color: 'color-mix(in srgb, #201e1d 60%, transparent)' }}>{t.lPhone}</p>
                                <p className="m-0 text-[16px]">+60 3-8060 1234</p>
                            </div>
                            <div>
                                <p className="m-0 mb-1 text-xs tracking-[0.08em] uppercase" style={{ color: 'color-mix(in srgb, #201e1d 60%, transparent)' }}>{t.lEmail}</p>
                                <p className="m-0 text-[16px]">sales@m1supplies.my</p>
                            </div>
                            <div>
                                <p className="m-0 mb-1 text-xs tracking-[0.08em] uppercase" style={{ color: 'color-mix(in srgb, #201e1d 60%, transparent)' }}>{t.lAddr}</p>
                                <p className="m-0 text-[16px] leading-relaxed">Lot 12, Jalan Industri 3,<br />47100 Puchong, Selangor</p>
                            </div>
                        </div>
                        <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block whitespace-nowrap px-5 py-3 text-sm font-extrabold text-[#f3f2f2] no-underline" style={{ background: ACCENT }}>
                            {t.heroWa}
                        </a>
                        <Placeholder label="Map screenshot" className="mt-9" style={{ aspectRatio: '16/7' }} />
                    </div>
                    <form
                        data-reveal
                        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                        className="grid content-start gap-5"
                    >
                        <Field label={t.fName} id="f-name" required />
                        <Field label={t.fShop} id="f-shop" />
                        <Field label={t.fPhoneEmail} id="f-mail" required />
                        <div>
                            <label htmlFor="f-msg" className="mb-1.5 block text-xs" style={{ color: 'color-mix(in srgb, #201e1d 70%, transparent)' }}>{t.fMsg}</label>
                            <textarea id="f-msg" rows={6} className="w-full border border-[#201e1d]/40 bg-[#eae9e9] px-2.5 py-1.5 text-sm outline-none focus:border-[#ec3013]" />
                        </div>
                        <div>
                            <button type="submit" className="whitespace-nowrap px-5 py-3 text-sm font-extrabold text-[#f3f2f2]" style={{ background: ACCENT }}>
                                {sent ? t.fSent : t.fSend}
                            </button>
                        </div>
                    </form>
                </section>

                <hr className="m-0 h-0.5 border-0 bg-[#201e1d]/40" />
                <footer className="flex flex-wrap justify-between gap-4 py-7 pb-14 text-[13px] leading-relaxed" style={{ color: 'color-mix(in srgb, #201e1d 70%, transparent)' }}>
                    <span>© 2026 M1 Supplies Sdn Bhd</span>
                    <span>{t.footerNote}</span>
                </footer>
            </div>
        </div>
    );
}

function Field({ label, id, required }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-xs" style={{ color: 'color-mix(in srgb, #201e1d 70%, transparent)' }}>{label}</label>
            <input id={id} type="text" required={required} className="w-full border border-[#201e1d]/40 bg-[#eae9e9] px-2.5 py-1.5 text-sm outline-none focus:border-[#ec3013]" />
        </div>
    );
}

function rise(delay) {
    return { animationDelay: `${delay}s` };
}
