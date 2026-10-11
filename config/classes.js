// Dance styles and fitness class catalog (slug, name, description, accent).

export const danceStyles = [
  {
    slug: "classical",
    name: "Classical",
    badge: "Traditional",
    description: "Master the ancient forms with precision, grace, and storytelling.",
    layout: "feature",
    gradient: "from-[#5b2a1f] via-[#7a3520] to-[#c9862c]",
    imageUrl: "https://res.cloudinary.com/fexwwils/image/upload/v1787826699/clasical_dance.png",
  },
  {
    slug: "hip-hop",
    name: "Hip-Hop",
    layout: "photo",
    gradient: "from-[#1c1140] via-[#3a1f6b] to-[#6d3bd1]",
    imageUrl: "https://res.cloudinary.com/fexwwils/image/upload/v1787824736/HipHop.png",
  },
  {
    slug: "contemporary",
    name: "Contemporary",
    layout: "photo",
    gradient: "from-[#0f2a3a] via-[#144a5c] to-[#1d7a8c]",
    imageUrl: "https://res.cloudinary.com/fexwwils/image/upload/v1787824960/contemerory.png",
  },
  {
    slug: "jazz",
    name: "Jazz",
    layout: "wide",
    gradient: "from-[#3a0f1f] via-[#6b1530] to-[#b0203f]",
    imageUrl: "https://res.cloudinary.com/fexwwils/image/upload/v1787824961/jazz.png",
  },
  {
    slug: "kids",
    name: "Kids",
    layout: "photo",
    gradient: "from-[#0f3a34] via-[#177a63] to-[#3ecf8e]",
    imageUrl: "https://res.cloudinary.com/fexwwils/image/upload/v1787824963/kids.png",
  },
  {
    slug: "lyrical",
    name: "Lyrical",
    layout: "icon",
    iconName: "sparkles",
    imageUrl:"https://res.cloudinary.com/fexwwils/image/upload/v1787825163/lyrical-dance-Miami.webp",
  },
  {
    slug: "bollywood",
    name: "Bollywood",
    layout: "icon",
    iconName: "music",
    imageUrl:"https://res.cloudinary.com/fexwwils/image/upload/v1787825163/Bollywood.jpg",
  },
  {
    slug: "freestyle",
    name: "Freestyle",
    layout: "icon",
    iconName: "zap",
    imageUrl:"https://res.cloudinary.com/fexwwils/image/upload/v1787825162/Freestyle.jpg",
  },
];

export const classCatalog = [
  {
    slug: "classical",
    name: "Classical",
    level: "Beginner/Adv",
    ageGroup: "All Ages",
    ages: ["all"],
    style: "classical",
    blurb: "Master ancient forms with precision.",
    gradient: "from-[#5b2a1f] via-[#7a3520] to-[#c9862c]",
    heroImage: null,
    heroGradient: "from-[#3a1f10] via-[#5b2a1f]/60 to-background",
    price: 2800,
    description:
      "Our Classical Mastery class is rooted in centuries-old tradition, teaching precise footwork, expressive storytelling, and the discipline that built Indian classical dance into an art form. We honour the fundamentals while helping every dancer find their own voice within the form.\n\nWhether you're starting from zero or refining an existing repertoire, our curriculum builds technique layer by layer, batch by batch.",
    whatYoullLearn: [
      "Foundational Postures & Mudras",
      "Rhythmic Footwork (Tatkar)",
      "Expression & Storytelling (Abhinaya)",
      "Classical Repertoire Pieces",
      "Breath Control & Stamina",
      "Stage Presence & Performance Polish",
    ],
    batchTimings: [
      { day: "Mon, Wed, Fri", time: "04:00 PM - 05:00 PM", trainer: "Trishna", seats: 6, price: 2800 },
      { day: "Tue, Thu, Sat", time: "05:30 PM - 07:00 PM", trainer: "Trishna", seats: 9, price: 2800 },
      { day: "Weekends (Sat-Sun)", time: "09:00 AM - 11:00 AM", trainer: "Trishna", seats: 4, price: 3200 },
    ],
    trainer: {
      name: "Trishna",
      photo: null,
      bio: "ASM's founder and lead classical instructor. Fifteen years of training and performance have shaped a teaching style built on patience, precision, and heart.",
    },
    gallery: [
      "from-[#5b2a1f] via-surface to-[#c9862c]",
      "from-[#3a1f10] via-surface to-[#8a5200]",
      "from-brand-start/30 via-surface to-brand-mid/20",
      "from-[#c9862c]/40 via-surface to-[#5b2a1f]/40",
    ],
    faqs: [
      {
        q: "Is prior classical training required?",
        a: "No — our Beginner batches start from the very first posture. Advanced batches are available once fundamentals are solid.",
      },
      {
        q: "What should I wear to class?",
        a: "Comfortable, stretchy clothing that allows deep bends. Traditional practice sarees or salwars are welcome but not required — bare feet are standard.",
      },
      {
        q: "Are ghungroos (ankle bells) provided?",
        a: "Not initially. Your trainer will let you know once you're ready to start footwork with ghungroos — we can point you to where to buy a pair.",
      },
    ],
  },
  {
    slug: "contemporary",
    name: "Contemporary",
    level: "Open",
    ageGroup: "Teens/Adults",
    ages: ["teens", "adults"],
    style: "contemporary",
    blurb: "Expressive movement and fluid storytelling.",
    gradient: "from-[#0f2a3a] via-[#144a5c] to-[#1d7a8c]",
    heroImage: null,
    heroGradient: "from-[#0a1f2a] via-[#144a5c]/60 to-background",
    price: 3200,
    description:
      "Our Contemporary class blends technical strength with raw emotional honesty. We teach dancers to move through space with intention — falling, recovering, and finding beauty in the in-between.\n\nExpect floor work, partner trust exercises, and choreography that asks you to feel as much as it asks you to move.",
    whatYoullLearn: [
      "Floor Work & Release Technique",
      "Contraction & Release Fundamentals",
      "Partner Work & Trust Exercises",
      "Improvisation & Movement Exploration",
      "Emotional Storytelling Through Movement",
      "Choreographic Composition",
    ],
    batchTimings: [
      { day: "Mon, Wed, Fri", time: "06:00 PM - 07:00 PM", trainer: "Sarah", seats: 7, price: 3200 },
      { day: "Tue, Thu", time: "07:30 PM - 09:00 PM", trainer: "Sarah", seats: 10, price: 3200 },
      { day: "Weekends (Sun)", time: "11:00 AM - 01:00 PM", trainer: "Sarah", seats: 5, price: 3600 },
    ],
    trainer: {
      name: "Sarah",
      photo: null,
      bio: "Classically trained with a modern edge, Sarah builds classes around honest movement — technique in service of feeling, not the other way around.",
    },
    gallery: [
      "from-[#0f2a3a] via-surface to-[#1d7a8c]",
      "from-brand-mid/30 via-surface to-brand-end/20",
      "from-[#144a5c]/40 via-surface to-[#0f2a3a]/40",
      "from-brand-start/15 via-surface to-brand-end/25",
    ],
    faqs: [
      {
        q: "Is this class suitable for absolute beginners?",
        a: "Open level means all backgrounds are welcome — we scale movement to where you're at, though some dance background helps with pacing.",
      },
      {
        q: "What kind of shoes do I need?",
        a: "None — contemporary is danced barefoot or in thin foot thongs (paw covers), which we can point you to if you'd like extra grip.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Yes, just let the front desk know at least 24 hours ahead and we'll move you to an open slot.",
      },
    ],
  },
  {
    slug: "hip-hop",
    name: "Hip-Hop",
    level: "Intermediate",
    ageGroup: "Teens & Adults",
    ages: ["teens", "adults"],
    style: "hip-hop",
    blurb: "Raw energy and street style foundations.",
    gradient: "from-[#1c1140] via-[#3a1f6b] to-[#6d3bd1]",
    heroImage: null,
    heroGradient: "from-[#120a2e] via-[#3a1f6b]/60 to-background",
    price: 3500,
    description:
      "Our Hip-Hop Mastery class is designed for those who want to dive deep into urban dance culture. We teach the groove, the bounce, and the attitude that makes Hip-Hop one of the most expressive dance forms in the world.\n\nWhether you're looking to improve your freestyle or want to learn professional stage-ready choreography, our curriculum covers it all.",
    whatYoullLearn: [
      "Foundation: Bounce, Rock, and Bob",
      "Isolation and Body Control",
      "Professional Urban Choreography",
      "Freestyle and Improvisation Skills",
      "Musicality and Rhythm Understanding",
      "Stage Presence and Performance Polish",
    ],
    batchTimings: [
      { day: "Mon, Wed, Fri", time: "05:00 PM - 06:00 PM", trainer: "Alex Johnson", seats: 5, price: 3500 },
      { day: "Tue, Thu, Sat", time: "06:30 PM - 08:00 PM", trainer: "Sarah K.", seats: 12, price: 3500 },
      { day: "Weekends (Sat-Sun)", time: "10:00 AM - 12:00 PM", trainer: "Alex Johnson", seats: 3, price: 4000 },
    ],
    trainer: {
      name: "Alex Johnson",
      photo: null,
      bio: "Battle-tested on the street, Alex brings raw energy and precision to every session — building dancers who can freestyle as confidently as they hit choreography.",
    },
    gallery: [
      "from-[#1c1140] via-surface to-[#6d3bd1]",
      "from-brand-mid/30 via-surface to-brand-start/20",
      "from-[#3a1f6b]/40 via-surface to-[#1c1140]/40",
      "from-brand-lime/15 via-surface to-brand-mid/25",
    ],
    faqs: [
      {
        q: "Is this class suitable for absolute beginners?",
        a: "Yes! Our Hip-Hop Beginner batches start from the ground up — no prior experience needed.",
      },
      {
        q: "What kind of shoes do I need?",
        a: "Clean, non-marking sneakers with good ankle support work best. Avoid running shoes with heavy tread.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Absolutely — just let the front desk know at least 24 hours ahead and we'll move you to an open slot.",
      },
    ],
  },
  {
    slug: "jazz",
    name: "Jazz",
    level: "Intermediate",
    ageGroup: "Teens/Adults",
    ages: ["teens", "adults"],
    style: "jazz",
    blurb: "Sharp, syncopated, and full of theatrical flair.",
    gradient: "from-[#3a0f1f] via-[#6b1530] to-[#b0203f]",
    heroImage: null,
    heroGradient: "from-[#2a0a15] via-[#6b1530]/60 to-background",
    price: 3000,
    description:
      "Jazz at ASM is sharp, theatrical, and full of personality. We build technical strength through turns, leaps, and isolations, then channel it into performance-ready choreography with real stage flair.\n\nExpect Broadway-inspired routines, strong musicality, and a class that isn't afraid to be a little dramatic.",
    whatYoullLearn: [
      "Jazz Squares & Isolations",
      "Turns, Leaps, and Kicks",
      "Sharp, Syncopated Musicality",
      "Theatrical Expression & Flair",
      "Broadway-Style Choreography",
      "Performance Confidence",
    ],
    batchTimings: [
      { day: "Mon, Wed", time: "06:00 PM - 07:00 PM", trainer: "Maya Chen", seats: 8, price: 3000 },
      { day: "Tue, Thu, Sat", time: "07:00 PM - 08:30 PM", trainer: "Maya Chen", seats: 6, price: 3000 },
      { day: "Weekends (Sun)", time: "12:00 PM - 01:30 PM", trainer: "Maya Chen", seats: 5, price: 3400 },
    ],
    trainer: {
      name: "Maya Chen",
      photo: null,
      bio: "Trained across musical theatre and commercial jazz, Maya brings sharp technique and even sharper stage presence to every batch she teaches.",
    },
    gallery: [
      "from-[#3a0f1f] via-surface to-[#b0203f]",
      "from-brand-start/30 via-surface to-brand-purple/20",
      "from-[#6b1530]/40 via-surface to-[#3a0f1f]/40",
      "from-brand-mid/15 via-surface to-brand-start/25",
    ],
    faqs: [
      {
        q: "Is this class suitable for absolute beginners?",
        a: "It runs Intermediate, so some dance background (ballet, hip-hop, or contemporary) helps you keep pace with the choreography.",
      },
      {
        q: "What kind of shoes do I need?",
        a: "Jazz shoes or clean sneakers with a smooth sole for turns. We can recommend where to buy jazz shoes locally.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Yes — give the front desk 24 hours' notice and we'll slot you into another open batch.",
      },
    ],
  },
  {
    slug: "kids",
    name: "Kids",
    level: "All Levels",
    ageGroup: "Ages 5-12",
    ages: ["kids"],
    style: "kids",
    blurb: "Playful, confidence-building classes for our youngest dancers.",
    gradient: "from-[#0f3a34] via-[#177a63] to-[#3ecf8e]",
    heroImage: null,
    heroGradient: "from-[#0a2a24] via-[#177a63]/60 to-background",
    price: 2000,
    description:
      "Our Kids program turns rhythm, coordination, and confidence-building into a game. Young dancers learn real technique through play, music, and a whole lot of encouragement — no pressure, just progress.\n\nEvery term ends with a mini showcase so every child gets their moment on stage.",
    whatYoullLearn: [
      "Basic Coordination & Rhythm Games",
      "Creative Movement & Imagination Play",
      "Introduction to Counting Music",
      "Confidence Building Through Performance",
      "Teamwork & Group Choreography",
      "Fun Recital-Ready Routines",
    ],
    batchTimings: [
      { day: "Mon, Wed", time: "04:00 PM - 05:00 PM", trainer: "Priya Nair", seats: 8, price: 2000 },
      { day: "Tue, Thu", time: "04:00 PM - 05:00 PM", trainer: "Priya Nair", seats: 6, price: 2000 },
      { day: "Weekends (Sat)", time: "10:00 AM - 11:00 AM", trainer: "Priya Nair", seats: 10, price: 2200 },
    ],
    trainer: {
      name: "Priya Nair",
      photo: null,
      bio: "A former competitive dancer turned kids' specialist, Priya makes every class feel like playtime — while quietly building real technique underneath.",
    },
    gallery: [
      "from-[#0f3a34] via-surface to-[#3ecf8e]",
      "from-brand-lime/25 via-surface to-brand-end/15",
      "from-[#177a63]/40 via-surface to-[#0f3a34]/40",
      "from-brand-start/15 via-surface to-brand-lime/20",
    ],
    faqs: [
      {
        q: "What's the minimum age to join?",
        a: "Our Kids program welcomes dancers from age 5 through 12, grouped by age band within class.",
      },
      {
        q: "What should my child wear?",
        a: "Comfortable clothes they can move freely in, and bare feet or soft ballet slippers. No zippers or buttons that dig in!",
      },
      {
        q: "Can parents watch the class?",
        a: "Yes — we have a viewing window, and the last class of each term is an open showcase for family and friends.",
      },
    ],
  },
  {
    slug: "lyrical",
    name: "Lyrical",
    level: "Intermediate/Adv",
    ageGroup: "Teens/Adults",
    ages: ["teens", "adults"],
    style: "lyrical",
    blurb: "Storytelling through movement, set to music that moves you.",
    gradient: "from-[#3a0f2e] via-[#6b1f52] to-[#c94f8c]",
    heroImage: null,
    heroGradient: "from-[#2a0a20] via-[#6b1f52]/60 to-background",
    price: 3300,
    description:
      "Lyrical is where technique meets raw emotion. We take contemporary and ballet vocabulary and set it to music with real lyrics — every movement is chosen to tell part of the story the song is telling.\n\nThis class asks for vulnerability as much as flexibility, and it rewards both.",
    whatYoullLearn: [
      "Emotive Storytelling Technique",
      "Fluid Transitions & Extensions",
      "Musical Interpretation",
      "Contemporary-Ballet Fusion Basics",
      "Partner & Ensemble Lyrical Work",
      "Performance Quality & Artistry",
    ],
    batchTimings: [
      { day: "Mon, Thu", time: "07:00 PM - 08:00 PM", trainer: "Sarah", seats: 7, price: 3300 },
      { day: "Wed, Sat", time: "05:00 PM - 06:30 PM", trainer: "Sarah", seats: 5, price: 3300 },
      { day: "Weekends (Sun)", time: "02:00 PM - 03:30 PM", trainer: "Sarah", seats: 6, price: 3600 },
    ],
    trainer: {
      name: "Sarah",
      photo: null,
      bio: "Sarah pairs contemporary training with a deep love of storytelling — her lyrical classes are known for being as emotionally honest as they are technical.",
    },
    gallery: [
      "from-[#3a0f2e] via-surface to-[#c94f8c]",
      "from-brand-mid/25 via-surface to-brand-start/20",
      "from-[#6b1f52]/40 via-surface to-[#3a0f2e]/40",
      "from-brand-end/15 via-surface to-brand-purple/20",
    ],
    faqs: [
      {
        q: "Do I need a ballet or contemporary background?",
        a: "Some is recommended since we run Intermediate/Advanced, but strong contemporary students are welcome to try a trial class first.",
      },
      {
        q: "What should I wear?",
        a: "Fitted, stretchy clothing so your trainer can see lines clearly. Danced barefoot or in foot thongs.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Yes, with 24 hours' notice to the front desk we'll move you into another open lyrical batch.",
      },
    ],
  },
  {
    slug: "modern",
    name: "Modern",
    level: "Open",
    ageGroup: "Teens/Adults",
    ages: ["teens", "adults"],
    style: "modern",
    blurb: "Bold, experimental technique that breaks traditional form.",
    gradient: "from-[#0f1a3a] via-[#1f356b] to-[#3f7ac9]",
    heroImage: null,
    heroGradient: "from-[#0a1428] via-[#1f356b]/60 to-background",
    price: 3400,
    description:
      "Modern dance at ASM is about breaking rules on purpose. We explore contraction and release, fall and recovery, and weight-sharing floor work — building dancers who move with intention instead of just imitation.\n\nExpect experimental choreography and a class culture that rewards finding your own movement voice.",
    whatYoullLearn: [
      "Contraction & Release (Graham Technique)",
      "Fall & Recovery (Humphrey Technique)",
      "Experimental & Abstract Movement",
      "Floor Work & Weight Sharing",
      "Breaking Traditional Form",
      "Original Choreographic Voice",
    ],
    batchTimings: [
      { day: "Tue, Fri", time: "06:30 PM - 07:30 PM", trainer: "Kabir Rao", seats: 9, price: 3400 },
      { day: "Mon, Wed, Sat", time: "05:00 PM - 06:00 PM", trainer: "Kabir Rao", seats: 6, price: 3400 },
      { day: "Weekends (Sun)", time: "04:00 PM - 05:30 PM", trainer: "Kabir Rao", seats: 4, price: 3800 },
    ],
    trainer: {
      name: "Kabir Rao",
      photo: null,
      bio: "Kabir trained across modern and street styles before finding his voice in experimental choreography — his classes push dancers to question the 'right' way to move.",
    },
    gallery: [
      "from-[#0f1a3a] via-surface to-[#3f7ac9]",
      "from-brand-mid/25 via-surface to-brand-end/20",
      "from-[#1f356b]/40 via-surface to-[#0f1a3a]/40",
      "from-brand-lime/15 via-surface to-brand-mid/20",
    ],
    faqs: [
      {
        q: "Is this class suitable for absolute beginners?",
        a: "Open level means all backgrounds are welcome — some contemporary or ballet grounding helps but isn't required.",
      },
      {
        q: "What kind of shoes do I need?",
        a: "None — modern is danced barefoot or in thin foot thongs, same as contemporary.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Yes, just give the front desk 24 hours' notice and we'll move you to another open slot.",
      },
    ],
  },
  {
    slug: "zumba",
    name: "Zumba",
    level: "All Levels",
    ageGroup: "Adults",
    ages: ["adults"],
    style: "zumba",
    blurb: "High-intensity cardio disguised as a dance party.",
    gradient: "from-[#5a1f0f] via-[#9a3a1a] to-[#e0752a]",
    heroImage: null,
    heroGradient: "from-[#3a1408] via-[#9a3a1a]/60 to-background",
    price: 1800,
    description:
      "Zumba at ASM is cardio that doesn't feel like a workout. We mix Latin rhythms with international beats and high-energy choreography that keeps every session feeling like a dance party, not a gym class.\n\nNo counts to memorize, no perfect technique required — just show up and move.",
    whatYoullLearn: [
      "High-Energy Cardio Choreography",
      "Latin & International Rhythms",
      "Interval Training Basics",
      "Toning & Core Engagement",
      "Dance Fitness Fundamentals",
      "Stress-Relief Through Movement",
    ],
    batchTimings: [
      { day: "Mon, Wed, Fri", time: "07:00 AM - 08:00 AM", trainer: "Ritu Deshmukh", seats: 14, price: 1800 },
      { day: "Tue, Thu, Sat", time: "06:00 PM - 07:00 PM", trainer: "Ritu Deshmukh", seats: 10, price: 1800 },
      { day: "Weekends (Sun)", time: "08:00 AM - 09:00 AM", trainer: "Ritu Deshmukh", seats: 8, price: 2000 },
    ],
    trainer: {
      name: "Ritu Deshmukh",
      photo: null,
      bio: "A certified fitness instructor with a love of Latin dance, Ritu built ASM's Zumba program to be the workout people actually look forward to.",
    },
    gallery: [
      "from-[#5a1f0f] via-surface to-[#e0752a]",
      "from-brand-start/25 via-surface to-brand-lime/15",
      "from-[#9a3a1a]/40 via-surface to-[#5a1f0f]/40",
      "from-brand-mid/15 via-surface to-brand-start/20",
    ],
    faqs: [
      {
        q: "Is this class suitable for absolute beginners?",
        a: "Yes! Zumba is All Levels — every move has an easier variation, and instructors call them out live.",
      },
      {
        q: "What kind of shoes do I need?",
        a: "Cross-training or dance sneakers with good lateral support. Avoid running shoes — they grip too much for pivots.",
      },
      {
        q: "Can I switch batches if my schedule changes?",
        a: "Absolutely — Zumba batches are drop-in friendly, so just show up to any open session that fits your week.",
      },
    ],
  },
];

// `description` stays a short one-liner (used by the Home page Elite Fitness
// tiles); `eyebrow`/`longDescription`/`benefits`/`cta*`/`gradient` are the
// richer fields the full /services page needs.
export const fitnessClasses = [
  {
    slug: "zumba-aerobics",
    name: "Zumba & Aerobics",
    eyebrow: "Cardio Party",
    description: "High-intensity cardio disguised as a dance party.",
    accent: "brand-start",
    iconName: "party-popper",
    gradient: "from-[#5a1f0f] via-[#9a3a1a] to-[#e0752a]",
    longDescription:
      "High-energy dance-fitness fusion that burns calories while you have fun. No dance experience needed — just bring your energy and let the music do the rest.",
    benefits: [
      "Full cardio & toning",
      "300-600 cal/hr burn",
      "Improves stamina",
      "Sat/Tue 6 PM batch",
    ],
    ctaLabel: "Book Zumba Trial",
    ctaHref: "/classes/zumba",
  },
  {
    slug: "yoga",
    name: "Balance through Yoga",
    eyebrow: "Mind & Soul",
    description: "Mindful movement, flexibility, and core strength.",
    accent: "brand-end",
    iconName: "flower",
    gradient: "from-[#0a2a2a] via-[#146060] to-[#22d3ee]",
    longDescription:
      "Find your center with a practice that builds flexibility, strength, and mental clarity. From gentle Hatha flows to power yoga, we meet you where you are.",
    benefits: [
      "Flexibility & balance",
      "Stress reduction",
      "Daily/Wed 4 PM batch",
      "Weekends 8 AM batch",
    ],
    ctaLabel: "Start Your Journey",
    ctaHref: "/book-trial",
  },
  {
    slug: "kickboxing-mma",
    name: "Kickboxing & MMA",
    eyebrow: "Power & Discipline",
    description: "Raw power and discipline for complete conditioning.",
    accent: "brand-mid",
    iconName: "swords",
    gradient: "from-[#1c1140] via-[#3a1f6b] to-[#7c5cff]",
    longDescription:
      "Channel raw power into a full-body workout that builds strength, discipline, and real self-defense skills — no experience necessary.",
    benefits: [
      "Explosive power",
      "Self defense",
      "Mon/Wed/Fri 7 PM batch",
      "Sun 8 AM workshop",
    ],
    ctaLabel: "Join the Pro Squad",
    ctaHref: "/book-trial",
  },
  {
    slug: "corporate-fitness",
    name: "Corporate Wellness",
    eyebrow: "Teams & Wellness",
    description: "Tailored wellness programs for your entire team.",
    accent: "brand-lime",
    iconName: "building-2",
    gradient: "from-[#2a2a0f] via-[#5a5a1a] to-[#c6ff3a]",
    longDescription:
      "High-performing teams need a high-performance environment. We bring rhythm and wellness to your office to boost morale, focus, and physical health.",
    benefits: [
      "Team building",
      "Mental clarity",
      "Custom timings",
      "On-site / studio",
    ],
    ctaLabel: "Request Quote",
    ctaHref: "#corporate-request",
  },
];

// Resolves a class/fitness slug (as stored on TrialBooking.interests) to its display name.
export function interestName(slug) {
  const all = [...classCatalog, ...fitnessClasses];
  return all.find((c) => c.slug === slug)?.name ?? slug;
}
