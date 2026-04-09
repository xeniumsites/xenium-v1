import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Play, Pause, Music, Image, MessageSquareHeart, Flame, Video, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// Hero images
import heroBirthday from "@/assets/hero-birthday.jpg";
import heroAnniversary from "@/assets/hero-anniversary.jpg";
import heroProposal from "@/assets/hero-proposal.jpg";
import heroMemorial from "@/assets/hero-memorial.jpg";
import heroRetirement from "@/assets/hero-retirement.jpg";
import heroCorporate from "@/assets/hero-corporate.jpg";

// Gallery images
import galleryBirthday from "@/assets/gallery-birthday-1.jpg";
import galleryAnniversary from "@/assets/gallery-anniversary-1.jpg";
import galleryProposal from "@/assets/gallery-proposal-1.jpg";
import galleryMemorial from "@/assets/gallery-memorial-1.jpg";
import galleryRetirement from "@/assets/gallery-retirement-1.jpg";
import galleryCorporate from "@/assets/gallery-corporate-1.jpg";

const heroImages: Record<string, string> = {
  birthday: heroBirthday,
  anniversary: heroAnniversary,
  proposal: heroProposal,
  memorial: heroMemorial,
  retirement: heroRetirement,
  corporate: heroCorporate,
};

const galleryImages: Record<string, string> = {
  birthday: galleryBirthday,
  anniversary: galleryAnniversary,
  proposal: galleryProposal,
  memorial: galleryMemorial,
  retirement: galleryRetirement,
  corporate: galleryCorporate,
};

interface ExperienceData {
  title: string;
  tag: string;
  subtitle: string;
  dedicatedTo: string;
  from: string;
  gradient: string;
  story: string[];
  timeline: { year: string; event: string }[];
  messages: { from: string; text: string }[];
  photos: { label: string }[];
  song: string;
  videoCaption: string;
  animatedQuote: string;
  hasCandles?: boolean;
  candleCount?: number;
}

const experiences: Record<string, ExperienceData> = {
  birthday: {
    title: "For Her Birthday",
    tag: "Birthday Experience",
    subtitle: "A celebration of memories, love, and everything she means to you.",
    dedicatedTo: "Sarah",
    from: "James",
    gradient: "from-xenium-violet-deep to-xenium-rose",
    story: [
      "She walked into my life on an ordinary Tuesday and made every day after that extraordinary.",
      "This is for the woman who makes burnt toast feel like a five-star breakfast, whose laugh fills every room, and whose heart holds everyone she's ever loved.",
      "Happy Birthday, Sarah. You are loved beyond measure."
    ],
    timeline: [
      { year: "1995", event: "Born on a rainy October morning" },
      { year: "2010", event: "Won the state art competition" },
      { year: "2018", event: "Graduated with honors" },
      { year: "2021", event: "Started her dream job" },
      { year: "2024", event: "Celebrating 29 years of magic" },
    ],
    messages: [
      { from: "Mom", text: "You've always been my sunshine, even on the cloudiest days. Happy birthday, sweetheart." },
      { from: "Best Friend", text: "From sleepovers to adulting — you've made every chapter unforgettable." },
      { from: "James", text: "Every day with you feels like a gift. This one's just a little more official." },
    ],
    photos: [
      { label: "Childhood" },
      { label: "Graduation" },
      { label: "Adventures" },
      { label: "Together" },
      { label: "Celebrations" },
      { label: "Today" },
    ],
    song: "Perfect — Ed Sheeran",
    videoCaption: "A montage of Sarah's most joyful moments — from her first steps to her brightest smile.",
    animatedQuote: "Here's to 29 years of making the world more beautiful just by being in it.",
    hasCandles: true,
    candleCount: 29,
  },
  anniversary: {
    title: "10 Years Together",
    tag: "Anniversary Experience",
    subtitle: "A journey through your moments, milestones, and shared memories.",
    dedicatedTo: "Priya & Arjun",
    from: "Arjun",
    gradient: "from-xenium-rose to-xenium-amber",
    story: [
      "Ten years ago, two strangers became forever. This is the story of us.",
      "From the first nervous coffee date to building a home, raising a family, and learning that love isn't a feeling — it's a choice we make every single day.",
      "Here's to the next ten, and the ten after that."
    ],
    timeline: [
      { year: "2014", event: "First date at the corner café" },
      { year: "2016", event: "Said 'I love you' under the stars" },
      { year: "2018", event: "Got married in a garden ceremony" },
      { year: "2020", event: "Welcomed baby Aanya" },
      { year: "2024", event: "A decade of love, laughter, and us" },
    ],
    messages: [
      { from: "Arjun", text: "You're the plot twist I never saw coming and the ending I always wanted." },
      { from: "Aanya", text: "Mama and Papa, you're my favorite love story!" },
      { from: "Parents", text: "Watching you two grow together has been our greatest joy." },
    ],
    photos: [
      { label: "First Date" },
      { label: "The Proposal" },
      { label: "Wedding Day" },
      { label: "Parenthood" },
      { label: "Travels" },
      { label: "Today" },
    ],
    song: "Tum Hi Ho — Arijit Singh",
    videoCaption: "A cinematic journey through a decade of love — from their first date to today.",
    animatedQuote: "Love isn't a feeling. It's a choice we make every single day.",
  },
  proposal: {
    title: "The Proposal Story",
    tag: "Proposal Experience",
    subtitle: "A cinematic build-up to the most important question of your life.",
    dedicatedTo: "Mia",
    from: "Daniel",
    gradient: "from-xenium-violet-mid to-xenium-violet-deep",
    story: [
      "I've been carrying this question for months. It's lived in my pocket, my pillow, my heartbeat.",
      "Mia, from the moment you laughed at my worst joke, I knew. I knew you were the person I wanted to annoy for the rest of my life.",
      "So here it is — not just a question, but a promise. Will you marry me?"
    ],
    timeline: [
      { year: "2019", event: "Met at a friend's rooftop party" },
      { year: "2020", event: "Survived a pandemic — together" },
      { year: "2021", event: "Adopted Luna, the world's best dog" },
      { year: "2023", event: "Moved into our first apartment" },
      { year: "2024", event: "The beginning of forever" },
    ],
    messages: [
      { from: "Daniel", text: "You make the ordinary feel sacred. I want all my ordinary days to be with you." },
      { from: "Luna 🐾", text: "Woof. (Translation: Please say yes, I want a bigger backyard.)" },
      { from: "Mom", text: "We already consider her family. Make it official, son!" },
    ],
    photos: [
      { label: "The Beginning" },
      { label: "Adventures" },
      { label: "Home" },
      { label: "Luna" },
      { label: "Us" },
      { label: "Forever?" },
    ],
    song: "Marry Me — Train",
    videoCaption: "From strangers at a rooftop party to partners for life — this is their story.",
    animatedQuote: "Will you marry me?",
  },
  memorial: {
    title: "In Loving Memory",
    tag: "Memorial Tribute",
    subtitle: "A tribute to a life well lived — told through the voices of those who loved them.",
    dedicatedTo: "Robert James Mitchell (1952–2024)",
    from: "The Mitchell Family",
    gradient: "from-xenium-violet-deep/80 to-xenium-rose/60",
    story: [
      "Dad wasn't a man of many words. But the words he chose — they stayed with you forever.",
      "He taught us that strength isn't loud. That love doesn't need a stage. That showing up, every single day, is the bravest thing a person can do.",
      "This is for you, Dad. We carry you in everything we do."
    ],
    timeline: [
      { year: "1952", event: "Born in a small town with big dreams" },
      { year: "1978", event: "Married the love of his life, Helen" },
      { year: "1982", event: "Became a father for the first time" },
      { year: "2000", event: "Retired after 35 years of service" },
      { year: "2024", event: "Left us with a lifetime of love" },
    ],
    messages: [
      { from: "Helen", text: "You gave me the kind of love they write songs about. I'll see you again someday." },
      { from: "Michael", text: "You were my first hero, Dad. That hasn't changed." },
      { from: "Emily", text: "I still hear your voice when I need courage. Thank you for everything." },
    ],
    photos: [
      { label: "Young Days" },
      { label: "Wedding" },
      { label: "Family" },
      { label: "Career" },
      { label: "Grandkids" },
      { label: "Legacy" },
    ],
    song: "What a Wonderful World — Louis Armstrong",
    videoCaption: "A life captured in moments — laughter, love, and quiet strength.",
    animatedQuote: "We carry you in everything we do.",
  },
  retirement: {
    title: "A Retirement Tribute",
    tag: "Retirement Experience",
    subtitle: "Honoring years of passion, impact, and the legacy left behind.",
    dedicatedTo: "Dr. Anita Sharma",
    from: "The Team at City Hospital",
    gradient: "from-xenium-amber to-xenium-gold",
    story: [
      "For 30 years, Dr. Sharma didn't just treat patients — she healed people.",
      "She remembered every name. She stayed late when no one asked. She cried when she lost someone and celebrated when she saved them.",
      "Today, we don't say goodbye. We say thank you — for everything you gave that no textbook could teach."
    ],
    timeline: [
      { year: "1994", event: "Joined City Hospital as a young resident" },
      { year: "2002", event: "Became Head of Cardiology" },
      { year: "2010", event: "Launched the community heart health program" },
      { year: "2018", event: "Mentored over 200 young doctors" },
      { year: "2024", event: "A standing ovation, well earned" },
    ],
    messages: [
      { from: "Dr. Patel", text: "You didn't just teach medicine. You taught us what it means to care." },
      { from: "Nurse Rekha", text: "The corridors will miss your energy. We all will." },
      { from: "A Patient", text: "You saved my life in 2015. I named my daughter after you." },
    ],
    photos: [
      { label: "Early Days" },
      { label: "The Team" },
      { label: "Milestones" },
      { label: "Community" },
      { label: "Mentoring" },
      { label: "Farewell" },
    ],
    song: "Wind Beneath My Wings — Bette Midler",
    videoCaption: "30 years of healing, caring, and making a difference — one patient at a time.",
    animatedQuote: "Thank you — for everything you gave that no textbook could teach.",
  },
  corporate: {
    title: "Employee Appreciation",
    tag: "Corporate Experience",
    subtitle: "Recognizing the people who matter — beyond a certificate.",
    dedicatedTo: "Rahul Verma — Employee of the Year",
    from: "The Leadership Team",
    gradient: "from-xenium-violet-mid to-xenium-amber",
    story: [
      "Some people clock in. Rahul shows up. There's a difference.",
      "In five years, he's turned challenges into wins, strangers into teammates, and ordinary projects into extraordinary outcomes.",
      "This isn't just an award. It's a thank you — from every person whose day you've made better."
    ],
    timeline: [
      { year: "2019", event: "Joined as a junior developer" },
      { year: "2020", event: "Led the remote transition project" },
      { year: "2021", event: "Promoted to team lead" },
      { year: "2023", event: "Shipped the company's biggest product update" },
      { year: "2024", event: "Employee of the Year — unanimously chosen" },
    ],
    messages: [
      { from: "CEO", text: "Leaders like you don't come around often. Thank you for raising the bar." },
      { from: "Team", text: "You make Mondays bearable and Fridays better. We're lucky to work with you." },
      { from: "HR", text: "Your impact goes way beyond your job title. Congratulations, Rahul." },
    ],
    photos: [
      { label: "Day One" },
      { label: "Team Building" },
      { label: "Hackathon Win" },
      { label: "Launch Day" },
      { label: "Leadership" },
      { label: "The Award" },
    ],
    song: "Hall of Fame — The Script",
    videoCaption: "From day one to Employee of the Year — a journey of impact and dedication.",
    animatedQuote: "Leaders like you don't come around often.",
  },
};

// ─── Animated Typewriter Text ───
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse text-xenium-amber">|</span>}
    </span>
  );
}

// ─── Interactive Birthday Cake with Candles ───
function BirthdayCake({ candleCount = 5 }: { candleCount?: number }) {
  const displayCandles = Math.min(candleCount, 9);
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(displayCandles).fill(true));
  const [allBlown, setAllBlown] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const blowCandle = (index: number) => {
    setLitCandles(prev => {
      const next = [...prev];
      next[index] = false;
      const allOut = next.every(c => !c);
      if (allOut) {
        setAllBlown(true);
        setTimeout(() => setShowMessage(true), 600);
      }
      return next;
    });
  };

  const resetCandles = () => {
    setLitCandles(Array(displayCandles).fill(true));
    setAllBlown(false);
    setShowMessage(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="my-16"
    >
      <div className="text-center mb-6">
        <Sparkles size={18} className="text-xenium-amber mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Tap the candles to blow them out 🎂</p>
      </div>

      <div className="relative max-w-sm mx-auto">
        {/* Cake */}
        <div className="relative">
          {/* Candles row */}
          <div className="flex justify-center gap-3 mb-2 relative z-10">
            {litCandles.map((lit, i) => (
              <button
                key={i}
                onClick={() => lit && blowCandle(i)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Flame */}
                <AnimatePresence>
                  {lit && (
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="relative mb-1"
                    >
                      <Flame
                        size={16}
                        className="text-xenium-amber drop-shadow-[0_0_8px_hsl(var(--xenium-amber))]"
                        style={{ animation: `flicker ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate` }}
                      />
                      <div className="absolute inset-0 blur-md bg-xenium-amber/40 rounded-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {!lit && <div className="h-[28px]" />}
                {/* Candle stick */}
                <div
                  className="w-2 h-10 rounded-sm transition-all duration-300"
                  style={{
                    background: `linear-gradient(to bottom, 
                      hsl(${[330, 270, 38, 330, 270, 38, 330, 270, 38][i % 9]}, 50%, 60%), 
                      hsl(${[330, 270, 38, 330, 270, 38, 330, 270, 38][i % 9]}, 40%, 40%))`
                  }}
                />
              </button>
            ))}
          </div>

          {/* Cake layers */}
          <div className="relative">
            <div className="h-6 bg-gradient-to-r from-xenium-rose/60 via-xenium-amber/50 to-xenium-rose/60 rounded-t-xl mx-4" />
            <div className="h-14 bg-gradient-to-b from-xenium-violet-deep/40 to-xenium-violet-deep/60 rounded-lg mx-2 flex items-center justify-center">
              <span className="text-xs tracking-[0.3em] uppercase text-foreground/40">Happy Birthday</span>
            </div>
            <div className="h-10 bg-gradient-to-b from-xenium-rose/30 to-xenium-rose/50 rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-xenium-amber/40" />
                ))}
              </div>
            </div>
            <div className="h-4 bg-gradient-to-r from-xenium-gold/30 via-xenium-amber/40 to-xenium-gold/30 rounded-b-xl" />
          </div>

          {/* Glow when all blown */}
          <AnimatePresence>
            {allBlown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-xenium-amber/5 rounded-2xl blur-xl"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Birthday message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-8"
            >
              <p className="font-display text-2xl italic text-xenium-amber">🎉 Happy Birthday, Sarah! 🎉</p>
              <p className="text-sm text-muted-foreground mt-2">Make a wish...</p>
              <button onClick={resetCandles} className="mt-4 text-xs text-muted-foreground/50 hover:text-foreground/60 transition-colors underline">
                Relight candles
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Video Embed Section ───
function VideoEmbed({ caption, gradient }: { caption: string; gradient: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="my-16"
    >
      <div className="text-center mb-8">
        <Video size={20} className="text-xenium-amber mx-auto mb-3" />
        <h3 className="font-display text-2xl md:text-3xl font-light">The Video</h3>
      </div>
      <div
        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group max-w-3xl mx-auto"
        onClick={() => setPlaying(!playing)}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
        <div className="absolute inset-0 bg-background/60" />

        {/* Simulated video content */}
        <AnimatePresence>
          {playing ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Animated bars simulating video */}
              <div className="flex items-end gap-1 mb-6">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-xenium-amber/60 rounded-full"
                    animate={{ height: [10, 30 + Math.random() * 30, 10] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/60 italic max-w-md text-center px-4">{caption}</p>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-xenium-amber/60 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </div>
              </div>
              <button className="absolute top-4 right-4 text-foreground/40 hover:text-foreground/80 transition-colors">
                <Pause size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-foreground/30 flex items-center justify-center group-hover:border-xenium-amber/60 group-hover:bg-xenium-amber/10 transition-all duration-300">
                <Play size={24} className="text-foreground/50 group-hover:text-xenium-amber ml-1 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground/50 mt-4 uppercase tracking-widest">Play Video</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Floating Particles ───
function FloatingParticles({ color = "xenium-amber" }: { color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full bg-${color}/30`}
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${50 + Math.random() * 50}%`, `${Math.random() * 30}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function ExperiencePreview() {
  const { slug } = useParams<{ slug: string }>();
  const exp = experiences[slug || ""];
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhoto((p) => (exp ? (p + 1) % exp.photos.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [exp]);

  if (!exp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Experience not found</h1>
          <Link to="/" className="text-xenium-amber hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const heroImg = heroImages[slug || ""];
  const galleryImg = galleryImages[slug || ""];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Xenium
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 border border-border/50 px-3 py-1 rounded-full">
            Sample Preview
          </span>
        </div>
      </nav>

      {/* Hero with Image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={exp.title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        </div>
        <FloatingParticles />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-foreground/60 border border-foreground/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm bg-background/20">
              {exp.tag}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-5xl md:text-7xl font-light leading-tight mb-6 drop-shadow-lg"
          >
            {exp.title}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-foreground/80 text-lg md:text-xl leading-relaxed mb-4 drop-shadow-md"
          >
            {exp.subtitle}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex items-center justify-center gap-4 text-sm text-foreground/50"
          >
            <span>Dedicated to <span className="text-foreground/80 italic">{exp.dedicatedTo}</span></span>
            <span className="w-1 h-1 rounded-full bg-foreground/30" />
            <span>From <span className="text-foreground/80">{exp.from}</span></span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-foreground/20 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-foreground/30" />
          </div>
        </motion.div>
      </section>

      {/* Animated Quote Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Sparkles size={18} className="text-xenium-amber mx-auto mb-6" />
          <p className="font-display text-2xl md:text-4xl italic text-foreground/80 leading-relaxed">
            "<TypewriterText text={exp.animatedQuote} />"
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <Heart size={20} className="text-xenium-rose mx-auto mb-6" />
          </motion.div>
          {exp.story.map((p, i) => (
            <motion.p key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i + 1}
              className="font-display text-xl md:text-2xl text-foreground/80 leading-relaxed italic text-center mb-6 last:mb-0"
            >
              "{p}"
            </motion.p>
          ))}
        </div>
      </section>

      {/* Birthday Cake (only for birthday experience) */}
      {exp.hasCandles && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <BirthdayCake candleCount={exp.candleCount} />
          </div>
        </section>
      )}

      {/* Video Embed */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <VideoEmbed caption={exp.videoCaption} gradient={exp.gradient} />
        </div>
      </section>

      {/* Photo Gallery with Real Images */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12"
          >
            <Image size={20} className="text-xenium-amber mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Moments Captured</h2>
          </motion.div>

          {/* Featured large image */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="mb-6"
          >
            <div className="aspect-video rounded-2xl overflow-hidden relative group">
              <img
                src={galleryImg}
                alt="Featured moment"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={768}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.15em] text-foreground/70 bg-background/30 backdrop-blur-sm rounded-full px-3 py-1">
                {exp.photos[activePhoto]?.label || "Memory"}
              </div>
            </div>
          </motion.div>

          {/* Thumbnail grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {exp.photos.map((photo, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.5}
                className={`aspect-square rounded-xl overflow-hidden relative group cursor-pointer transition-all duration-500 ${
                  activePhoto === i ? 'ring-2 ring-xenium-amber/60 scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActivePhoto(i)}
              >
                <img
                  src={galleryImg}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={768}
                  style={{ filter: `hue-rotate(${i * 30}deg) brightness(${0.7 + i * 0.05})` }}
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-[0.1em] text-foreground/70 bg-background/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                  {photo.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-light">The Journey</h2>
          </motion.div>
          <div className="space-y-0">
            {exp.timeline.map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="flex gap-6 relative"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-3 h-3 rounded-full shrink-0 mt-2"
                    style={{ background: `linear-gradient(135deg, hsl(var(--xenium-violet-deep)), hsl(var(--xenium-amber)))` }}
                    whileInView={{ scale: [0.5, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                  />
                  {i < exp.timeline.length - 1 && (
                    <motion.div
                      className="w-px flex-1 min-h-[40px]"
                      style={{ background: `linear-gradient(to bottom, hsl(var(--xenium-violet-deep) / 0.4), transparent)` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2, duration: 0.6, origin: "top" }}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-xenium-amber text-xs font-semibold tracking-widest">{item.year}</span>
                  <p className="text-foreground/80 text-base mt-1">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Messages */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12"
          >
            <MessageSquareHeart size={20} className="text-xenium-violet-mid mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Words from the Heart</h2>
          </motion.div>
          <div className="space-y-6">
            {exp.messages.map((msg, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 1}
                className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className="absolute -top-3 left-8 text-5xl text-xenium-violet-mid/20 font-display">"</div>
                <p className="text-foreground/80 text-base leading-relaxed italic mb-4 pt-2">
                  {msg.text}
                </p>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">— {msg.from}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Playing - decorative */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, hsl(var(--xenium-violet-deep)), hsl(var(--xenium-amber)))` }}
            >
              <Music size={18} className="text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">Suggested Track</p>
              <p className="text-sm text-foreground/80 truncate">{exp.song}</p>
            </div>
            <div className="flex items-end gap-0.5">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-xenium-amber/50 rounded-full"
                  animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-muted-foreground text-sm mb-6">This is a sample Xenium experience.</p>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-4">
              Want one made for <span className="italic gradient-text">your story?</span>
            </h2>
            <p className="text-muted-foreground text-base mb-8">Every Xenium is unique — crafted around your memories, your words, your love.</p>
            <Link
              to="/"
              onClick={() => setTimeout(() => document.querySelector("#create")?.scrollIntoView({ behavior: "smooth" }), 100)}
              className="inline-flex items-center gap-2 text-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all"
              style={{ background: `linear-gradient(135deg, hsl(var(--xenium-violet-deep)), hsl(var(--xenium-amber)))` }}
            >
              Create Your Xenium
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Made with ❤️ by <Link to="/" className="text-xenium-amber/60 hover:text-xenium-amber transition-colors">Xenium</Link>
        </p>
      </footer>

      {/* Candle flicker CSS */}
      <style>{`
        @keyframes flicker {
          0% { transform: scale(1) rotate(-2deg); opacity: 0.9; }
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scale(0.95) rotate(-1deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
