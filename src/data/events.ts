export interface EventItem {
  slug: string; title: string; theme?: string; start?: string; // ISO with +01:00 (Nigeria); leave out if the date is unknown
  dateLabel: string; time: string; speaker?: string; flyer: string; flyerAlt: string; note?: string;
}

// Add new events at the top. Past events move to "Recent" automatically.
export const events: EventItem[] = [
  {
    slug: '3-years-anniversary-service',
    title: '3 Years Anniversary Service',
    theme: 'The Stone of Help',
    start: '2026-12-03T17:00:00+01:00',
    dateLabel: 'Thursday 3rd and Friday 4th December 2026',
    time: '5:00 PM',
    speaker: 'Pastor Innocent Micheal (guest speaker)',
    flyer: '/images/flyer-3-years-anniversary.webp',
    flyerAlt: 'Flyer for the 3 Years Anniversary Service, theme The Stone of Help, with Pastor Everest Chinakwaeze and guest speaker Pastor Innocent Micheal',
  },
  {
    slug: 'durable-fruitfulness',
    title: 'Encounter Service: Durable Fruitfulness',
    start: '2026-09-24T18:00:00+01:00',
    dateLabel: 'Thursday 24th September 2026',
    time: '6:00 PM',
    flyer: '/images/flyer-durable-fruitfulness.webp',
    flyerAlt: 'Flyer for Encounter Service number 72, Durable Fruitfulness, with Pastor Everest Chinakwaeze',
  },
  {
    slug: 'october-possibilities-through-holiness',
    title: 'October: Month of Possibilities Through Holiness',
    dateLabel: 'October',
    time: '',
    flyer: '/images/flyer-october-possibilities-through-holiness.webp',
    flyerAlt: 'Welcome to October, Month of Possibilities Through Holiness, Ebenezer\'s Place International',
  },
  {
    slug: 'possibilities-through-praise',
    title: 'Encounter Service: Possibilities Through Praise',
    dateLabel: 'Encounter Service',
    time: '',
    flyer: '/images/flyer-possibilities-through-praise.webp',
    flyerAlt: 'Welcome to Encounter Service, Possibilities Through Praise, Ebenezer\'s Place International',
  },
  {
    slug: 'rest-on-every-side-part-3',
    title: 'Rest on Every Side, Part 3',
    theme: '1 Kings 5:4',
    dateLabel: 'Thursday 23rd July',
    time: '6:00 PM',
    flyer: '/images/pastor-everest-chinakwaeze.webp',
    flyerAlt: 'Pastor Everest Chinakwaeze preaching at the Encounter Service, Rest on Every Side Part 3, at Ebenezer\'s Place International Ministry',
  },
];

export const isUpcoming = (e: EventItem) => !!e.start && new Date(e.start).getTime() + 2 * 86_400_000 > Date.now();
