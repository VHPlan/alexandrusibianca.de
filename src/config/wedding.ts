/**
 * Central wedding configuration.
 *
 * Every value marked `null` or `confirmed: false` is NOT yet confirmed by the couple.
 * The UI renders a tasteful "will be announced" text for those fields, and an explicit
 * "neconfirmat" badge while running in development (`next dev`).
 */

export const IMG = "/images/wedding";
export const SATIN_BG = `${IMG}/generated/satin-ivory.jpg`;

export type Confirmable<T> = { value: T | null; confirmed: boolean };

export const wedding = {
  couple: {
    bride: "Bianca",
    groom: "Alex",
    names: "Alex & Bianca",
    monogram: "A&B",
  },

  /** Wedding day. Countdown targets the start of the day in Europe/Berlin (CEST, UTC+2). */
  date: {
    iso: "2027-10-15T00:00:00+02:00",
    timeZone: "Europe/Berlin",
    short: "15.10.2027",
    long: "15 Octombrie 2027",
  },

  hero: {
    eyebrow: "The Wedding",
    cta: "Descoperă invitația",
    /** Atmospheric ballroom background */
    background: `${IMG}/hero-ballroom.jpg`,
  },

  story: {
    title: "Povestea noastră",
    subtitle: "Două suflete, o singură poveste...",
    intro:
      "După o călătorie plină de iubire, încredere și visuri comune, am decis să facem următorul pas și să ne unim destinele. Vă invităm să fiți alături de noi în cea mai frumoasă zi din viața noastră!",
    /** Paragraphs shown after "Citește întreaga poveste". Empty until the couple supplies them. */
    full: [] as string[],
    image: {
      src: `${IMG}/poveste-cuplu.jpg`,
      width: 935,
      height: 1024,
      alt: "Un cuplu de miri privind apusul",
      illustrative: false,
    },
  },

  details: {
    title: "Detaliile nunții",
    background: `${IMG}/generated/details-bg.jpg`,
    accentImage: { src: `${IMG}/03-verighete-detalii.png`, width: 164, height: 67 },
    items: [
      { key: "date", label: "Data nunții", value: "15.10.2027", icon: "calendar" },
      { key: "venue", label: "Sala evenimentului", value: "Lavin, Bruchsal", icon: "venue" },
      { key: "godparents", label: "Nașii", value: "2 perechi", icon: "users" },
      { key: "video", label: "Cameraman", value: "Crewetzel Events", icon: "camera" },
      {
        key: "music",
        label: "Lăutarii",
        value: "Florin Salam & Puișor de la Mediaș",
        icon: "music",
      },
    ],
  },

  godparents: [
    {
      id: "romi-sanda",
      names: "Romi & Sanda",
      initials: "R & S",
      photo: `${IMG}/nasi-2.jpg` as string | null,
      objectPosition: "48% 12%",
    },
    {
      id: "marius-paula",
      names: "Marius & Paula",
      initials: "M & P",
      photo: `${IMG}/nasi-1.jpg` as string | null,
      objectPosition: "52% 35%",
    },
  ],

  /** Event program — hours are NOT confirmed yet. Set `time` + `confirmed: true` when known. */
  timeline: {
    image: {
      src: `${IMG}/04-decor-masa-eveniment.png`,
      width: 288,
      height: 163,
      alt: "Decor de masă festivă cu trandafiri albi și lumânări",
    },
    events: [
      {
        id: "ceremony",
        title: "Cununia religioasă",
        description: "Momentul în care ne unim destinele la Biserica St. Laurentius.",
        time: "15:30" as string | null,
        confirmed: true,
        icon: "church",
      },
      {
        id: "photos",
        title: "Sesiune foto",
        description: "Amintiri surprinse alături de familie și prieteni.",
        time: null as string | null,
        confirmed: false,
        icon: "camera",
      },
      {
        id: "reception",
        title: "Primirea invitaților",
        description: "Vă întâmpinăm cu drag la sala Lavin Events.",
        time: "18:00" as string | null,
        confirmed: true,
        icon: "glass",
      },
      {
        id: "party",
        title: "Petrecerea",
        description: "Cină festivă, muzică live și dans până în zori.",
        time: null as string | null,
        confirmed: false,
        icon: "music",
      },
      {
        id: "cake",
        title: "Tortul miresei",
        description: "Un moment dulce, împărțit cu cei dragi.",
        time: null as string | null,
        confirmed: false,
        icon: "cake",
      },
    ],
  },

  /** Confirmed ceremony & reception locations. */
  locations: [
    {
      id: "church",
      kind: "Cununia religioasă",
      name: { value: "Biserica St. Laurentius", confirmed: true } as Confirmable<string>,
      namePending: "",
      address: { value: "Herrengasse 6", confirmed: true } as Confirmable<string>,
      city: { value: "76872 Minfeld, Germania", confirmed: true } as Confirmable<string>,
      note: null as string | null,
      time: "15:30" as string | null,
      mapsQuery: "Herrengasse 6, 76872 Minfeld, Germany" as string | null,
      image: { src: `${IMG}/biserica-st-laurentius.jpg`, width: 1024, height: 682, illustrative: false },
    },
    {
      id: "reception",
      kind: "Petrecerea",
      name: { value: "Lavin Events", confirmed: true } as Confirmable<string>,
      namePending: "",
      address: { value: "John-Deere-Straße 19", confirmed: true } as Confirmable<string>,
      city: { value: "76646 Bruchsal, Germania", confirmed: true } as Confirmable<string>,
      note: null as string | null,
      time: "18:00" as string | null,
      mapsQuery: "John-Deere-Straße 19, 76646 Bruchsal, Germany" as string | null,
      image: { src: `${IMG}/lavin-events.jpg`, width: 1024, height: 768, illustrative: false },
    },
  ],

  musicians: {
    title: "Lăutarii noștri",
    tagline: "Muzică live și o atmosferă de neuitat.",
    artists: [
      {
        id: "florin-salam",
        name: "Florin Salam",
        initials: "FS",
        photo: `${IMG}/florin-salam.jpg` as string | null,
        objectPosition: "50% 20%",
        illustrative: false,
      },
      {
        id: "puisor",
        name: "Puișor de la Mediaș",
        initials: "PM",
        photo: `${IMG}/puisor-medias.jpg` as string | null,
        objectPosition: "70% 22%",
        illustrative: false,
      },
    ],
  },

  /**
   * Gallery — high-resolution atmospheric decor images (no people).
   * The supplied crops 09–13 are only ~75 px tall, too small for a gallery/lightbox;
   * they remain in /public/images/wedding and can be swapped back here at any time.
   * Replace with real wedding photography after the event.
   */
  gallery: [
    { src: `${IMG}/generated/gallery-dress.jpg`, width: 1264, height: 848, alt: "Rochie de mireasă din dantelă lângă fereastră" },
    { src: `${IMG}/generated/gallery-bouquet.jpg`, width: 1264, height: 848, alt: "Buchet de mireasă cu trandafiri ivoire" },
    { src: `${IMG}/generated/details-bg.jpg`, width: 1376, height: 768, alt: "Verighete din aur pe satin, în lumina lumânărilor" },
    { src: `${IMG}/generated/rsvp-bg.jpg`, width: 1376, height: 768, alt: "Salon festiv luminat de candelabre și lumânări" },
    { src: `${IMG}/generated/hero-bg.jpg`, width: 1376, height: 768, alt: "Culoar ceremonial cu arcadă florală și lumânări" },
  ],

  rsvp: {
    title: "Confirmă prezența",
    background: `${IMG}/generated/rsvp-bg.jpg`,
    deadline: "15 August 2027" as string | null,
    maxGuests: 10,
    whatsapp: [
      { id: "alex", name: "Alex", display: "0176 5570 0551", phone: "4917655700551" },
      { id: "bianca", name: "Bianca", display: "0155 6344 1309", phone: "4915563441309" },
    ],
  },

  footer: {
    message: "Cu drag, vă așteptăm alături de noi!",
  },
} as const;

export const NAV_ITEMS = [
  { id: "acasa", label: "Acasă" },
  { id: "poveste", label: "Povestea noastră" },
  { id: "detalii", label: "Detalii" },
  { id: "nasii", label: "Nașii" },
  { id: "program", label: "Program" },
  { id: "locatii", label: "Locații" },
  { id: "lautarii", label: "Lăutarii" },
  { id: "galerie", label: "Galerie" },
  { id: "rsvp", label: "RSVP" },
] as const;

export const IS_DEV = process.env.NODE_ENV === "development";
