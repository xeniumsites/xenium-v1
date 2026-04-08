import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Play, Pause, Music, Image, MessageSquareHeart } from "lucide-react";
import { useState, useEffect } from "react";

const experiences: Record<string, {
  title: string;
  tag: string;
  subtitle: string;
  dedicatedTo: string;
  from: string;
  gradient: string;
  story: string[];
  timeline: { year: string; event: string }[];
  messages: { from: string; text: string }[];
  photos: { gradient: string; label: string }[];
  song: string;
}> = {
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
      { gradient: "from-xenium-rose/40 to-xenium-violet-deep/30", label: "Childhood" },
      { gradient: "from-xenium-amber/40 to-xenium-rose/30", label: "Graduation" },
      { gradient: "from-xenium-violet-mid/40 to-xenium-amber/30", label: "Adventures" },
      { gradient: "from-xenium-gold/40 to-xenium-violet-deep/30", label: "Together" },
      { gradient: "from-xenium-rose/30 to-xenium-gold/40", label: "Celebrations" },
      { gradient: "from-xenium-violet-deep/40 to-xenium-rose/20", label: "Today" },
    ],
    song: "Perfect — Ed Sheeran",
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
      { gradient: "from-xenium-rose/40 to-xenium-amber/30", label: "First Date" },
      { gradient: "from-xenium-amber/40 to-xenium-gold/30", label: "The Proposal" },
      { gradient: "from-xenium-violet-mid/40 to-xenium-rose/30", label: "Wedding Day" },
      { gradient: "from-xenium-gold/40 to-xenium-amber/30", label: "Parenthood" },
      { gradient: "from-xenium-rose/30 to-xenium-violet-deep/40", label: "Travels" },
      { gradient: "from-xenium-amber/40 to-xenium-rose/20", label: "Today" },
    ],
    song: "Tum Hi Ho — Arijit Singh",
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
      { gradient: "from-xenium-violet-deep/40 to-xenium-violet-mid/30", label: "The Beginning" },
      { gradient: "from-xenium-violet-mid/40 to-xenium-rose/30", label: "Adventures" },
      { gradient: "from-xenium-rose/40 to-xenium-violet-deep/30", label: "Home" },
      { gradient: "from-xenium-amber/30 to-xenium-violet-mid/40", label: "Luna" },
      { gradient: "from-xenium-violet-deep/30 to-xenium-gold/40", label: "Us" },
      { gradient: "from-xenium-gold/40 to-xenium-violet-deep/30", label: "Forever?" },
    ],
    song: "Marry Me — Train",
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
      { gradient: "from-xenium-violet-deep/30 to-xenium-rose/20", label: "Young Days" },
      { gradient: "from-xenium-rose/30 to-xenium-amber/20", label: "Wedding" },
      { gradient: "from-xenium-amber/30 to-xenium-gold/20", label: "Family" },
      { gradient: "from-xenium-violet-mid/30 to-xenium-violet-deep/20", label: "Career" },
      { gradient: "from-xenium-gold/30 to-xenium-rose/20", label: "Grandkids" },
      { gradient: "from-xenium-violet-deep/20 to-xenium-rose/30", label: "Legacy" },
    ],
    song: "What a Wonderful World — Louis Armstrong",
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
      { gradient: "from-xenium-amber/40 to-xenium-gold/30", label: "Early Days" },
      { gradient: "from-xenium-gold/40 to-xenium-amber/30", label: "The Team" },
      { gradient: "from-xenium-rose/30 to-xenium-amber/40", label: "Milestones" },
      { gradient: "from-xenium-violet-mid/30 to-xenium-gold/40", label: "Community" },
      { gradient: "from-xenium-amber/30 to-xenium-rose/30", label: "Mentoring" },
      { gradient: "from-xenium-gold/30 to-xenium-amber/40", label: "Farewell" },
    ],
    song: "Wind Beneath My Wings — Bette Midler",
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
      { gradient: "from-xenium-violet-mid/40 to-xenium-amber/30", label: "Day One" },
      { gradient: "from-xenium-amber/40 to-xenium-violet-mid/30", label: "Team Building" },
      { gradient: "from-xenium-rose/30 to-xenium-amber/40", label: "Hackathon Win" },
      { gradient: "from-xenium-gold/40 to-xenium-violet-mid/30", label: "Launch Day" },
      { gradient: "from-xenium-violet-mid/30 to-xenium-gold/40", label: "Leadership" },
      { gradient: "from-xenium-amber/30 to-xenium-rose/30", label: "The Award" },
    ],
    song: "Hall of Fame — The Script",
  },
};

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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotate photos
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
          <button
            onClick={() => setMusicPlaying(!musicPlaying)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {musicPlaying ? <Pause size={14} /> : <Play size={14} />}
            <Music size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-20`} />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-xenium-violet-deep/15 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-xenium-rose/10 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 border border-border/50 rounded-full px-4 py-1.5 mb-8">
              {exp.tag}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-5xl md:text-7xl font-light leading-tight mb-6"
          >
            {exp.title}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-4"
          >
            {exp.subtitle}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground/60"
          >
            <span>Dedicated to <span className="text-foreground/80 italic">{exp.dedicatedTo}</span></span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>From <span className="text-foreground/80">{exp.from}</span></span>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <Heart size={20} className="text-xenium-rose mx-auto mb-6 animate-icon-heartbeat" />
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

      {/* Photo Gallery */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12"
          >
            <Image size={20} className="text-xenium-amber mx-auto mb-4 animate-icon-breathe" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Moments Captured</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exp.photos.map((photo, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${photo.gradient} relative overflow-hidden group cursor-pointer transition-all duration-500 ${activePhoto === i ? 'ring-2 ring-xenium-amber/50 scale-[1.02]' : 'hover:scale-[1.02]'}`}
                onClick={() => setActivePhoto(i)}
              >
                <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.15em] text-foreground/60 bg-background/30 backdrop-blur-sm rounded-full px-3 py-1">
                  {photo.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
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
                  <div className="w-3 h-3 rounded-full gradient-full shrink-0 mt-2" />
                  {i < exp.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-xenium-violet-deep/40 to-transparent min-h-[40px]" />
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
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12"
          >
            <MessageSquareHeart size={20} className="text-xenium-violet-mid mx-auto mb-4 animate-icon-sway" />
            <h2 className="font-display text-3xl md:text-4xl font-light">Words from the Heart</h2>
          </motion.div>
          <div className="space-y-6">
            {exp.messages.map((msg, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 1}
                className="glass-card p-8 relative"
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

      {/* Now Playing */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg gradient-full flex items-center justify-center shrink-0">
              <Music size={18} className="text-foreground animate-icon-sway" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">Now Playing</p>
              <p className="text-sm text-foreground/80 truncate">{exp.song}</p>
            </div>
            <button
              onClick={() => setMusicPlaying(!musicPlaying)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {musicPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
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
              className="inline-flex items-center gap-2 gradient-full text-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all glow-violet"
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
    </div>
  );
}
