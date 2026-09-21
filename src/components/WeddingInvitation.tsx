import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  Heart,
  MapPin,
  Menu,
  Music2,
  Pause,
  Sparkles,
  X,
} from "lucide-react";
import Lenis from "lenis";

import coupleImage from "@/assets/wedding-couple.png";
import floralCorner from "@/assets/floral-corner.png";
import galleryFlowers from "@/assets/gallery-flowers.jpg";
import galleryRings from "@/assets/gallery-rings.jpg";
import galleryTextile from "@/assets/gallery-textile.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const receptionDate = new Date("2026-11-28T11:30:00+05:30");
const receptionMaps = "https://www.google.com/maps/search/?api=1&query=Crown+Palace+Kuzhalmannam+Palakkad";
const nikahMaps = "https://www.google.com/maps/search/?api=1&query=Crown+Palace+Kuzhalmannam+Palakkad";

function Ornament({ label }: { label?: string }) {
  return (
    <div className="ornament" aria-hidden={label ? undefined : true}>
      <span />
      <Heart className="h-3.5 w-3.5 fill-current" />
      <span />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

function useCountdown() {
  const calculate = () => {
    const difference = Math.max(0, receptionDate.getTime() - Date.now());
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1_000) % 60),
    };
  };
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    setTime(calculate());
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

function RollingDigit({ value }: { value: number }) {
  return (
    <span key={value} className="rolling-digit inline-block">
      {String(value).padStart(2, "0")}
    </span>
  );
}

function Countdown() {
  const time = useCountdown();
  return (
    <div className="countdown" aria-label="Countdown to the wedding reception">
      {Object.entries(time).map(([label, value]) => (
        <div key={label} className="countdown-item">
          <strong><RollingDigit value={value} /></strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Opening({ onOpen, isOpening }: { onOpen: () => void; isOpening?: boolean }) {
  return (
    <div className={`opening ${isOpening ? "is-opening-out" : ""}`} role="dialog" aria-modal="true" aria-label="Wedding invitation">
      <img src={floralCorner} alt="" className="opening-floral" />
      <div className="envelope">
        <div className="envelope-flap" />
        <div className="invitation-card">
          <span className="eyebrow">28 · 11 · 2026</span>
          <Heart className="seal-heart" aria-hidden="true" />
          <h2>You Are Invited</h2>
          <p>Thasleema &amp; Ashik</p>
          <Button size="lg" onClick={onOpen} className="invitation-button">
            Open Invitation
          </Button>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ["Home", "#home"],
    ["Details", "#details"],
    ["Nikah", "#nikah"],
    ["Ceremony", "#reception"],
    ["RSVP", "#rsvp"],
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      setOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="floating-nav" aria-label="Wedding invitation navigation">
      <a href="#home" className="nav-monogram" aria-label="Thasleema and Ashik home" onClick={(e) => handleScroll(e, "#home")}>T <Heart /> A</a>
      <div className="desktop-links">
        {links.map(([name, href]) => <a key={href} href={href} onClick={(e) => handleScroll(e, href)}>{name}</a>)}
      </div>
      <Button variant="ghost" size="icon" className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <div className="mobile-links">
          {links.map(([name, href]) => <a key={href} href={href} onClick={(e) => handleScroll(e, href)}>{name}</a>)}
        </div>
      )}
    </nav>
  );
}

function Particles() {
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 15}s`,
    delay: `-${Math.random() * 20}s`,
    size: `${8 + Math.random() * 10}px`,
    rotation: `${Math.random() * 360}deg`
  }));
  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, width: p.size, height: p.size, "--duration": p.duration, "--delay": p.delay, "--start-rot": p.rotation } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <header id="home" className="hero">
      <Particles />
      <img src={floralCorner} alt="" className="hero-floral hero-floral-left" />
      <img src={floralCorner} alt="" className="hero-floral hero-floral-right" />
      <div className="gold-arch" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-quote">“And We created you in pairs.”</p>
        <Ornament />
        <p className="blessing" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        <p className="eyebrow">You are invited</p>
        <h1><span>Thasleema M</span><small>with</small><span>Ashik Ashraf</span></h1>
        <p className="script-title">Nikah</p>
        <p className="hero-date">Saturday · 28 November 2026</p>
        <Countdown />
        <Button asChild variant="outline" size="lg" className="view-button">
          <a href="#details">View Invitation <ChevronDown /></a>
        </Button>
      </div>
      <img src={coupleImage} width={896} height={1200} alt="Bride and groom in traditional wedding attire" className="couple-image" />
    </header>
  );
}

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="section-heading reveal">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="reveal-group">
        {typeof children === "string" ? (
          children.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom pb-2">
              <span className="split-word reveal-child">{word}</span>
            </span>
          ))
        ) : (
          children
        )}
      </h2>
      <Ornament />
    </div>
  );
}

function FamilyDetails() {
  return (
    <section id="details" className="section family-section">
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-left" />
      <div className="section-inner">
        <SectionHeading eyebrow="Together with our families">With Joy in Our Hearts</SectionHeading>
        <div className="family-grid reveal-group">
          <article className="reveal-child">
            <h3>Thasleema M</h3>
            <p className="relation">D/o Mr. Muhammad Musthafa A &amp;<br />Mrs. Nazeerabanu R (Late)</p>
            <p>Puthankalam (H), Chithali,<br />Kuzhalmannam</p>
          </article>
          <div className="and-mark reveal-child">and</div>
          <article className="reveal-child">
            <h3>Ashik Ashraf</h3>
            <p className="relation">S/o Mr. Ashraf S &amp; Mrs. Sara V</p>
            <p>Aisha Manzil, Kanjiraparambu,<br />Kavilpad, Olavakkode</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, title, children }: { icon: typeof CalendarDays; title: string; children: React.ReactNode }) {
  return (
    <div className="info-item">
      <Icon aria-hidden="true" />
      <div><span>{title}</span><p>{children}</p></div>
    </div>
  );
}

function Reception() {
  return (
    <section id="reception" className="section reception-section">
      <div className="section-inner reception-inner">
        <SectionHeading eyebrow="The sacred union">Nikah Ceremony</SectionHeading>
        <div className="date-lockup reveal">
          <span>Saturday</span>
          <div><i>November</i><strong>28</strong><i>2026</i></div>
          <p>11:30 AM to 12:00 PM</p>
        </div>
        <div className="details-row reveal">
          <InfoItem icon={CalendarDays} title="Date">28 November 2026</InfoItem>
          <InfoItem icon={Clock3} title="Time">11:30 AM – 12:00 PM</InfoItem>
          <InfoItem icon={MapPin} title="Venue">Crown Palace, Kuzhalmannam</InfoItem>
        </div>
        <Button asChild size="lg" className="gold-button"><a href={receptionMaps} target="_blank" rel="noreferrer"><MapPin /> Get Directions</a></Button>
      </div>
    </section>
  );
}

function Nikah() {
  return (
    <section id="nikah" className="section nikah-section">
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-right" />
      <div className="section-inner nikah-inner reveal">
        <Sparkles className="nikah-icon" aria-hidden="true" />
        <p className="eyebrow">The sacred union</p>
        <h2>Nikah</h2>
        <Ornament />
        <h3>Crown Palace</h3>
        <p>Kuzhalmannam</p>
        <div className="nikah-date"><strong>28</strong><span>November 2026<br />11:30 AM – 12:00 PM</span></div>
        <Button asChild variant="outline" size="lg"><a href={nikahMaps} target="_blank" rel="noreferrer"><MapPin /> View Location</a></Button>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section timeline-section">
      <div className="section-inner narrow">
        <SectionHeading eyebrow="A cherished moment">Our Nikah</SectionHeading>
        <div className="timeline reveal-group">
          <article className="reveal-child"><span className="timeline-dot" /><time>28 November 2026</time><h3>Nikah</h3><p>11:30 AM – 12:00 PM</p><small>Crown Palace, Kuzhalmannam</small></article>
          <article className="reveal-child"><span className="timeline-dot" /><time>28 November 2026</time><h3>Blessings &amp; Celebration</h3><p>From 12:00 PM</p><small>Crown Palace, Kuzhalmannam</small></article>
        </div>
      </div>
    </section>
  );
}

function CalendarOptions() {
  const [open, setOpen] = useState(false);
  const details = encodeURIComponent("Together with our families, we invite you to celebrate with us.");
  const location = encodeURIComponent("Crown Palace, Kuzhalmannam, Palakkad");
  const title = encodeURIComponent("Thasleema M & Ashik Ashraf — Nikah");
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261128T060000Z/20261128T063000Z&details=${details}&location=${location}`;
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=2026-11-28T11%3A30%3A00%2B05%3A30&enddt=2026-11-28T12%3A00%3A00%2B05%3A30&location=${location}&body=${details}`;
  const downloadIcs = () => {
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "DTSTART:20261128T060000Z", "DTEND:20261128T063000Z", "SUMMARY:Thasleema M & Ashik Ashraf — Nikah", "LOCATION:Crown Palace, Kuzhalmannam, Palakkad", "DESCRIPTION:Together with our families, we invite you to celebrate with us.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "thasleema-ashik-nikah.ics"; anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="calendar-wrap">
      <Button size="lg" onClick={() => setOpen(!open)} className="gold-button"><CalendarDays /> Add to Calendar</Button>
      {open && <div className="calendar-menu"><a href={google} target="_blank" rel="noreferrer">Google Calendar</a><a href={outlook} target="_blank" rel="noreferrer">Outlook</a><button type="button" onClick={downloadIcs}><Download /> Apple / ICS</button></div>}
    </div>
  );
}

function VenueMap() {
  return (
    <section className="section venue-section">
      <div className="section-inner">
        <SectionHeading eyebrow="Find your way">The Venue</SectionHeading>
        <div className="venue-grid reveal-group">
          <article className="reveal-child">
            <iframe title="Map of Crown Palace, Kuzhalmannam" loading="lazy" src="https://www.google.com/maps?q=Crown%20Palace%20Kuzhalmannam%20Palakkad&output=embed" />
            <div><span>Nikah Venue</span><h3>Crown Palace</h3><p>Kuzhalmannam, Palakkad</p><a href={receptionMaps} target="_blank" rel="noreferrer">Get Directions <MapPin /></a></div>
          </article>

        </div>
        <CalendarOptions />
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="quote-section section">
      <img src={floralCorner} alt="" loading="lazy" className="quote-floral" />
      <div className="reveal"><Ornament /><blockquote>“And We created you in pairs.”</blockquote><p>Thasleema &amp; Ashik</p></div>
    </section>
  );
}

const gallery = [
  { src: galleryFlowers, alt: "Burgundy and terracotta wedding flowers with antique gold ribbon", width: 1024, height: 1280 },
  { src: galleryRings, alt: "Antique gold wedding rings surrounded by burgundy blossoms", width: 1280, height: 1024 },
  { src: galleryTextile, alt: "Deep burgundy bridal fabric with intricate antique gold embroidery", width: 1024, height: 1280 },
];

function TiltCard({ image, onClick }: { image: any; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };
  return (
    <button ref={ref} type="button" className="reveal-child tilt-card" onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} aria-label={`Enlarge ${image.alt}`}>
      <img src={image.src} alt={image.alt} loading="lazy" width={image.width} height={image.height} />
    </button>
  );
}

function Gallery() {
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(null);
  return (
    <section className="section gallery-section">
      <div className="section-inner">
        <SectionHeading eyebrow="A glimpse of what awaits">Moments of Love</SectionHeading>
        <div className="gallery-grid reveal-group">
          {gallery.map((image) => <TiltCard key={image.src} image={image} onClick={() => setSelected(image)} />)}
        </div>
      </div>
      {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged gallery image" onClick={() => setSelected(null)}><Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close gallery"><X /></Button><img src={selected.src} alt={selected.alt} /></div>}
    </section>
  );
}

function RSVP() {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try { window.localStorage.setItem("thasleema-ashik-rsvp", JSON.stringify({ ...data, attending })); } catch { /* Confirmation still works when storage is unavailable. */ }
    setSubmitted(true);
  };
  return (
    <section id="rsvp" className="section rsvp-section">
      <div className="section-inner narrow">
        <SectionHeading eyebrow="Kindly respond">We Would Love to Celebrate With You</SectionHeading>
        <p className="rsvp-intro">Your presence would make our celebration even more special.</p>
        {submitted ? (
          <div className="rsvp-success animate-scale-in" role="status"><Heart className="fill-current" /><h3>{attending === "yes" ? "We can’t wait to celebrate with you" : "You’ll be in our thoughts"}</h3><p>Thank you for letting us know.</p><Button variant="outline" onClick={() => setSubmitted(false)}>Update response</Button></div>
        ) : (
          <form className="rsvp-form reveal" onSubmit={submit}>
            <label>Guest Name<Input name="name" required maxLength={100} placeholder="Your full name" /></label>
            <label>Number of Guests<Input name="guests" type="number" required min={1} max={10} defaultValue={1} /></label>
            <fieldset><legend>Will you be attending?</legend><div className="attending-choice"><button type="button" className={attending === "yes" ? "active" : ""} onClick={() => setAttending("yes")}><Heart /> Joyfully Accepting</button><button type="button" className={attending === "no" ? "active" : ""} onClick={() => setAttending("no")}><X /> Unable to Attend</button></div></fieldset>
            <label>Message <span>(optional)</span><Textarea name="message" maxLength={500} rows={4} placeholder="Share a note for the couple" /></label>
            <Button type="submit" size="lg" className="gold-button">Send RSVP <Heart /></Button>
          </form>
        )}
      </div>
    </section>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{ context: AudioContext; oscillators: OscillatorNode[] } | null>(null);
  const toggle = () => {
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((oscillator) => oscillator.stop());
      void audioRef.current.context.close();
      audioRef.current = null; setPlaying(false); return;
    }
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.018; gain.connect(context.destination);
    const oscillators = [261.63, 329.63, 392].map((frequency) => {
      const oscillator = context.createOscillator(); oscillator.type = "sine"; oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start(); return oscillator;
    });
    audioRef.current = { context, oscillators }; setPlaying(true);
  };
  useEffect(() => () => { audioRef.current?.oscillators.forEach((oscillator) => oscillator.stop()); void audioRef.current?.context.close(); }, []);
  return <Button size="icon" onClick={toggle} className={`music-button ${playing ? "playing" : ""}`} aria-label={playing ? "Pause ambient music" : "Play ambient music"}>{playing ? <Pause /> : <Music2 />}</Button>;
}

function Footer() {
  return <footer><Ornament /><p>Best compliments from</p><h2>Muhammad Ismail</h2><time>28 November 2026</time></footer>;
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let animationFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("textarea")) {
        cursorRef.current?.classList.add("cursor-hover");
      } else {
        cursorRef.current?.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    const render = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}

export function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setOpened(true);
    }, 1300); // 1.3 seconds matches the new animation timing
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          const children = Array.from(entry.target.querySelectorAll(".reveal-child"));
          children.forEach((child, index) => {
            (child as HTMLElement).style.transitionDelay = `${index * 120}ms`;
            child.classList.add("revealed");
          });
        } else {
          entry.target.classList.remove("revealed");
          const children = Array.from(entry.target.querySelectorAll(".reveal-child"));
          children.forEach((child) => {
            (child as HTMLElement).style.transitionDelay = "0ms";
            child.classList.remove("revealed");
          });
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    const nodes = document.querySelectorAll(".reveal, .reveal-group, .reveal-scale");
    nodes.forEach((node) => observer.observe(node));

    const lenis = new Lenis({ autoRaf: true });

    lenis.on("scroll", (e: any) => {
      const scrollY = e.animatedScroll;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    });
    
    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, [opened]);
  const opening = useMemo(() => !opened && <Opening onOpen={handleOpen} isOpening={isOpening} />, [opened, isOpening]);
  return (
    <main className={opened ? "invitation-open" : "invitation-closed"}>
      <Cursor />
      {opening}
      <Navigation />
      <Hero />
      <FamilyDetails />
      <Nikah />
      <Reception />
      <Timeline />
      <VenueMap />
      <Quote />
      <Gallery />
      <RSVP />
      <Footer />
      <MusicPlayer />
    </main>
  );
}