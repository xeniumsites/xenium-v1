import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Play, Pause, Image as ImageIcon, MessageSquareHeart, Flame, Video, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

// Hero images
import heroBirthday from "@/assets/hero-birthday.jpg";
import heroAnniversary from "@/assets/hero-anniversary.jpg";
import heroProposal from "@/assets/hero-proposal.jpg";
import heroMemorial from "@/assets/hero-memorial.jpg";
import heroRetirement from "@/assets/hero-retirement.jpg";
import heroCorporate from "@/assets/hero-corporate.jpg";

// Gallery images — set 1 (existing)
import galleryBirthday1 from "@/assets/gallery-birthday-1.jpg";
import galleryAnniversary1 from "@/assets/gallery-anniversary-1.jpg";
import galleryProposal1 from "@/assets/gallery-proposal-1.jpg";
import galleryMemorial1 from "@/assets/gallery-memorial-1.jpg";
import galleryRetirement1 from "@/assets/gallery-retirement-1.jpg";
import galleryCorporate1 from "@/assets/gallery-corporate-1.jpg";

// Gallery images — set 2
import galleryBirthday2 from "@/assets/gallery-birthday-2.jpg";
import galleryBirthday3 from "@/assets/gallery-birthday-3.jpg";
import galleryAnniversary2 from "@/assets/gallery-anniversary-2.jpg";
import galleryAnniversary3 from "@/assets/gallery-anniversary-3.jpg";
import galleryProposal2 from "@/assets/gallery-proposal-2.jpg";
import galleryProposal3 from "@/assets/gallery-proposal-3.jpg";
import galleryMemorial2 from "@/assets/gallery-memorial-2.jpg";
import galleryMemorial3 from "@/assets/gallery-memorial-3.jpg";
import galleryRetirement2 from "@/assets/gallery-retirement-2.jpg";
import galleryRetirement3 from "@/assets/gallery-retirement-3.jpg";
import galleryCorporate2 from "@/assets/gallery-corporate-2.jpg";
import galleryCorporate3 from "@/assets/gallery-corporate-3.jpg";

const heroImages: Record<string, string> = {
  birthday: heroBirthday,
  anniversary: heroAnniversary,
  proposal: heroProposal,
  memorial: heroMemorial,
  retirement: heroRetirement,
  corporate: heroCorporate,
};

interface PhotoItem { label: string; src: string; }

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
  photos: PhotoItem[];
  song: string;
  videoCaption: string;
  videoTitle: string;
  videoDuration: string;
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
      { label: "Celebration", src: galleryBirthday1 },
      { label: "Make a Wish", src: galleryBirthday2 },
      { label: "The Gift", src: galleryBirthday3 },
      { label: "Together", src: heroBirthday },
    ],
    song: "Perfect — Ed Sheeran",
    videoCaption: "A montage of Sarah's most joyful moments — from her first steps to her brightest smile.",
    videoTitle: "Sarah — A Life in Moments",
    videoDuration: "01:24",
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
      { label: "Together", src: galleryAnniversary1 },
      { label: "Vows", src: galleryAnniversary2 },
      { label: "Letters", src: galleryAnniversary3 },
      { label: "A Decade", src: heroAnniversary },
    ],
    song: "Tum Hi Ho — Arijit Singh",
    videoCaption: "A cinematic journey through a decade of love — from their first date to today.",
    videoTitle: "Priya & Arjun — Ten Years",
    videoDuration: "02:08",
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
      { label: "Us", src: galleryProposal1 },
      { label: "The Ring", src: galleryProposal2 },
      { label: "The Skyline", src: galleryProposal3 },
      { label: "Forever?", src: heroProposal },
    ],
    song: "Marry Me — Train",
    videoCaption: "From strangers at a rooftop party to partners for life — this is their story.",
    videoTitle: "Mia & Daniel — Will You?",
    videoDuration: "01:46",
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
      { label: "Remembering", src: galleryMemorial1 },
      { label: "His Light", src: galleryMemorial2 },
      { label: "His Words", src: galleryMemorial3 },
      { label: "Legacy", src: heroMemorial },
    ],
    song: "What a Wonderful World — Louis Armstrong",
    videoCaption: "A life captured in moments — laughter, love, and quiet strength.",
    videoTitle: "Robert — A Life Well Lived",
    videoDuration: "02:32",
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
      { label: "The Years", src: galleryRetirement1 },
      { label: "Her Calling", src: galleryRetirement2 },
      { label: "Standing Ovation", src: galleryRetirement3 },
      { label: "Legacy", src: heroRetirement },
    ],
    song: "Wind Beneath My Wings — Bette Midler",
    videoCaption: "30 years of healing, caring, and making a difference — one patient at a time.",
    videoTitle: "Dr. Sharma — Thirty Years",
    videoDuration: "02:14",
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
      { label: "The Team", src: galleryCorporate1 },
      { label: "The Award", src: galleryCorporate2 },
      { label: "The Boardroom", src: galleryCorporate3 },
      { label: "Recognition", src: heroCorporate },
    ],
    song: "Hall of Fame — The Script",
    videoCaption: "From day one to Employee of the Year — a journey of impact and dedication.",
    videoTitle: "Rahul — Five Years In",
    videoDuration: "01:58",
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
      className="my-12 sm:my-16"
    >
      <div className="text-center mb-6">
        <Sparkles size={18} className="text-xenium-amber mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Tap the candles to blow them out 🎂</p>
      </div>

      <div className="relative max-w-sm mx-auto">
        <div className="relative">
          <div className="flex justify-center gap-2 sm:gap-3 mb-2 relative z-10">
            {litCandles.map((lit, i) => (
              <button
                key={i}
                onClick={() => lit && blowCandle(i)}
                className="flex flex-col items-center cursor-pointer group"
                style={{ touchAction: "manipulation" }}
                aria-label={lit ? "Blow out candle" : "Candle out"}
              >
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

// ─── Cinematic Video Embed ───
function VideoEmbed({
  poster,
  caption,
  title,
  duration,
}: {
  poster: string;
  caption: string;
  title: string;
  duration: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="my-12 sm:my-16"
    >
      <div className="text-center mb-8">
        <Video size={20} className="text-xenium-amber mx-auto mb-3" />
        <h2 className="font-display text-2xl md:text-3xl font-light">The Video</h2>
      </div>

      <div
        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group max-w-3xl mx-auto border border-border/50 shadow-2xl"
        onClick={() => setPlaying(!playing)}
        style={{ touchAction: "manipulation" }}
        role="button"
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {/* Poster image with Ken Burns when playing */}
        <motion.img
          src={poster}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={720}
          animate={playing ? { scale: [1, 1.08], x: [0, -10] } : { scale: 1, x: 0 }}
          transition={playing ? { duration: 12, ease: "linear" } : { duration: 0.6 }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/40" />

        {/* Top-left trust badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10">
          <Sparkles size={11} className="text-xenium-amber" />
          <span className="font-display italic text-[11px] text-foreground/80">Original Xenium Video</span>
        </div>

        {/* Top-right HD pill */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-background/50 backdrop-blur-md border border-foreground/10 text-foreground/70">
          HD
        </div>

        {/* Center play / pause */}
        <AnimatePresence mode="wait">
          {playing ? (
            <motion.button
              key="pause"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Pause"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/40 backdrop-blur-md border border-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pause size={22} className="text-foreground/90" />
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-xenium-amber/30 blur-xl animate-glow-pulse" />
                <div className="absolute -inset-3 rounded-full border border-xenium-amber/40 animate-ping opacity-50" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-xenium-amber/95 flex items-center justify-center shadow-[0_10px_40px_-10px_hsl(var(--xenium-amber)/0.7)] group-hover:scale-105 transition-transform">
                  <Play size={26} className="text-background ml-1" fill="currentColor" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-base sm:text-lg text-foreground/95 truncate">{title}</p>
              <p className="text-[11px] text-foreground/60 truncate">{caption}</p>
            </div>
            <span className="shrink-0 text-[11px] text-foreground/70 px-2 py-0.5 rounded bg-background/50 backdrop-blur-md border border-foreground/10">
              {duration}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-[3px] bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              key={playing ? "p1" : "p0"}
              className="h-full bg-gradient-to-r from-xenium-amber via-xenium-rose to-xenium-violet-mid rounded-full"
              initial={{ width: playing ? "0%" : "0%" }}
              animate={{ width: playing ? "100%" : "0%" }}
              transition={{ duration: playing ? 12 : 0.4, ease: "linear" }}
            />
          </div>
        </div>
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
    }, 3500);
    return () => clearInterval(interval);
  }, [exp]);

  const pageTitle = exp ? `${exp.title} — Xenium Experience Preview` : "Experience — Xenium";
  const pageDescription = exp
    ? `${exp.subtitle} A sample ${exp.tag.toLowerCase()} from Xenium — personalized digital gifting for ${exp.dedicatedTo}.`.slice(0, 158)
    : "Sample preview of a personalized Xenium digital gifting experience.";
  const canonicalUrl = `https://xenium-sites.com/experience/${slug ?? ""}`;

  const helmet = (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );

  if (!exp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {helmet}
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Experience not found</h1>
          <Link to="/" className="text-xenium-amber hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const heroImg = heroImages[slug || ""];
  const featuredPhoto = exp.photos[activePhoto];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {helmet}
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" aria-label="Experience preview navigation">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Xenium</span><span className="sm:hidden">Back</span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 border border-border/50 px-3 py-1 rounded-full">
            Sample Preview
          </span>
        </div>
      </nav>

      {/* Hero with Image */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden pt-16" aria-label="Experience hero">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={`${exp.title} — ${exp.tag}`}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        </div>
        <FloatingParticles />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-foreground/60 border border-foreground/20 rounded-full px-4 py-1.5 mb-6 sm:mb-8 backdrop-blur-sm bg-background/20">
              {exp.tag}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6 drop-shadow-lg"
          >
            {exp.title}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-foreground/80 text-base sm:text-lg md:text-xl leading-relaxed mb-4 drop-shadow-md"
          >
            {exp.subtitle}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-foreground/50"
          >
            <span>Dedicated to <span className="text-foreground/80 italic">{exp.dedicatedTo}</span></span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-foreground/30" />
            <span>From <span className="text-foreground/80">{exp.from}</span></span>
          </motion.div>
        </div>

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
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="Featured quote">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Sparkles size={18} className="text-xenium-amber mx-auto mb-6" />
          <p className="font-display text-xl sm:text-2xl md:text-4xl italic text-foreground/80 leading-relaxed">
            "<TypewriterText text={exp.animatedQuote} />"
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="Their story">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <Heart size={20} className="text-xenium-rose mx-auto mb-6" />
          </motion.div>
          {exp.story.map((p, i) => (
            <motion.p key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i + 1}
              className="font-display text-lg sm:text-xl md:text-2xl text-foreground/80 leading-relaxed italic text-center mb-6 last:mb-0"
            >
              "{p}"
            </motion.p>
          ))}
        </div>
      </section>

      {/* Birthday Cake (only for birthday experience) */}
      {exp.hasCandles && (
        <section className="py-10 sm:py-12 px-4 sm:px-6" aria-label="Interactive birthday cake">
          <div className="max-w-5xl mx-auto">
            <BirthdayCake candleCount={exp.candleCount} />
          </div>
        </section>
      )}

      {/* Video Embed */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="Featured video">
        <div className="max-w-5xl mx-auto">
          <VideoEmbed
            poster={heroImg}
            caption={exp.videoCaption}
            title={exp.videoTitle}
            duration={exp.videoDuration}
          />
        </div>
      </section>

      {/* Photo Gallery with distinct images */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="Moments captured">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-10 sm:mb-12"
          >
            <ImageIcon size={20} className="text-xenium-amber mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Moments Captured</h2>
            <p className="text-muted-foreground/60 text-sm mt-3">A few moments — each its own memory.</p>
          </motion.div>

          {/* Featured large image */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="mb-4 sm:mb-6"
          >
            <div className="aspect-video rounded-2xl overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhoto}
                  src={featuredPhoto.src}
                  alt={`${exp.dedicatedTo} — ${featuredPhoto.label} moment from their ${exp.tag.toLowerCase()}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={576}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xs uppercase tracking-[0.15em] text-foreground/80 bg-background/40 backdrop-blur-md rounded-full px-3 py-1 border border-foreground/10">
                {featuredPhoto.label}
              </div>
            </div>
          </motion.div>

          {/* Thumbnail grid — 4 distinct images */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {exp.photos.map((photo, i) => (
              <motion.button
                type="button"
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.4}
                className={`aspect-square rounded-xl overflow-hidden relative group transition-all duration-500 ${
                  activePhoto === i ? "ring-2 ring-xenium-amber/70 scale-[1.02]" : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                }`}
                onClick={() => setActivePhoto(i)}
                style={{ touchAction: "manipulation" }}
                aria-label={`Show ${photo.label}`}
              >
                <img
                  src={photo.src}
                  alt={`${exp.dedicatedTo} — ${photo.label} photo from their ${exp.tag.toLowerCase()}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={512}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent group-hover:from-background/30 transition-colors duration-300" />
                <div className="absolute bottom-1.5 left-1.5 text-[10px] uppercase tracking-[0.1em] text-foreground/85 bg-background/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                  {photo.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="The journey timeline">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-10 sm:mb-12"
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
                      transition={{ delay: i * 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <div className="pb-8 min-w-0">
                  <span className="text-xenium-amber text-xs font-semibold tracking-widest">{item.year}</span>
                  <p className="text-foreground/80 text-base mt-1">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Messages */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" aria-label="Words from the heart">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-10 sm:mb-12"
          >
            <MessageSquareHeart size={20} className="text-xenium-violet-mid mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Words from the Heart</h2>
          </motion.div>
          <div className="space-y-5 sm:space-y-6">
            {exp.messages.map((msg, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 1}
                className="relative p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className="absolute -top-3 left-6 sm:left-8 text-5xl text-xenium-violet-mid/20 font-display">"</div>
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed italic mb-4 pt-2">
                  {msg.text}
                </p>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">— {msg.from}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center">
        <p className="text-muted-foreground/70 text-sm mb-4">Want one made for someone you love?</p>
        <Link
          to="/#create"
          className="inline-block gradient-full text-foreground font-semibold px-7 py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity glow-violet"
        >
          Create Your Xenium
        </Link>
      </section>
    </div>
  );
}
