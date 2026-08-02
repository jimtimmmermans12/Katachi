// Journal content — single source of truth for the journal index,
// the article pages, and the sitemap.
//
// Published essays live in ARTICLES (with full body copy); planned pieces
// live in UPCOMING and render as "Coming soon" cards on the index.

export type JournalArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** ISO date, e.g. "2026-06-12" */
  date: string;
  readingTime: string;
  /** Body paragraphs, rendered in order. */
  content: string[];
};

export type UpcomingArticle = {
  title: string;
  category: string;
  excerpt: string;
};

export const ARTICLES: JournalArticle[] = [
  {
    slug: "the-quiet-mechanics-of-ritual",
    title: "The quiet mechanics of ritual",
    category: "Ritual",
    excerpt:
      "How a slower ritual reshapes everyday life with calm intention.",
    date: "2026-06-12",
    readingTime: "4 min read",
    content: [
      "A ritual is not a routine. A routine is what happens when you stop paying attention; a ritual is what happens when you start. The same kettle, the same cup, the same three minutes of waiting — what changes is only the quality of your presence. That change is everything.",
      "Most mornings do not fail loudly. They erode. The phone comes first, then the rush, and by the time the first cup is empty the day has already decided its own pace. A ritual is a small act of resistance against that erosion. It says: this moment is not a corridor to the next one. It is a room of its own.",
      "The objects you reach for first carry more weight than they appear to. A bowl with real mass slows the hand that lifts it. A glaze that shifts in morning light gives the eye somewhere to rest. These are not decorations of the ritual — they are its mechanics. The body follows what the hand feels.",
      "This is why the Japanese tea tradition never separated the vessel from the ceremony. The chawan is not equipment; it is a participant. Its weight sets the tempo. Its width invites the whisk to move in wide, unhurried strokes. You cannot rush a bowl that refuses to be rushed.",
      "You do not need a tradition to begin. Choose one moment you already repeat every day — the first tea, the last light turned off, the table set for one. Remove what interrupts it. Keep only what serves it. Then let the moment take the time it actually needs, rather than the time that is left over.",
      "What returns, slowly, is proportion. The day stops arriving all at once. Tasks queue instead of crowd. It is not that the ritual gives you more hours; it gives you back the sense that the hours are yours.",
      "Own less. Choose well. Begin the day as if it deserved it.",
    ],
  },
  {
    slug: "on-the-weight-of-a-good-bowl",
    title: "On the weight of a good bowl",
    category: "Objects",
    excerpt:
      "Why mass and tactility tell you more about an object's character than its appearance.",
    date: "2026-07-08",
    readingTime: "5 min read",
    content: [
      "Photographs lie about objects. Not deliberately — but a photograph can only report what a thing looks like, and looks are the least honest part of an object's character. The truth of a bowl is in the first second it rests in your hands: the mass, the balance, the temperature of the material meeting your skin.",
      "Weight is information. A bowl with substance tells you about the wall of clay it was thrown from, the density of the stoneware, the decision of a maker who did not thin the form to save material. Lightness can be a virtue in a travel cup. In a bowl made for the table, it usually reads as absence.",
      "There is a reason the hand trusts weight. For most of human history, heft meant durability, and durability meant the object would still be there next season. That instinct has not left us. We only stopped listening to it, somewhere between the third and fourth shelf of things that were cheap enough not to think about.",
      "Tactility is the second honest sense. A glaze that is glass-smooth on the inside and leaves the clay bare at the foot lets you feel the object's two lives at once — the refined surface that meets the food, and the raw material that meets the table. Run a thumb over that transition and you know more about the piece than any product page can tell you.",
      "Temperature, too. Stoneware warms slowly and holds its warmth, which is why a good bowl seems to participate in the meal rather than merely contain it. Thin industrial ceramic reaches room temperature and stays there, inert. The difference is subtle, and like most subtle differences, it is the one you end up living with.",
      "None of this argues for heaviness as a style. It argues for honesty as a standard. An object should feel like what it is. When form, material, and weight agree with each other, the hand relaxes — it has been told the truth.",
      "So when you choose the next object for your table, close your eyes for a moment. The eyes are persuaded by surfaces. The hands are harder to fool.",
    ],
  },
];

export const UPCOMING: UpcomingArticle[] = [
  {
    title: "Material stories in the kitchen",
    category: "Craft",
    excerpt:
      "A closer look at craftspeople keeping slow, considered making alive in a world that rewards speed above all else.",
  },
  {
    title: "Restraint as a room's best feature",
    category: "Interiors",
    excerpt:
      "The discipline of stopping before adding one thing too many — and what that empty space quietly gives back.",
  },
  {
    title: "What linen knows that cotton forgot",
    category: "Material",
    excerpt:
      "The case for natural, aged textiles in the home — and why softening with time is a feature, not a flaw.",
  },
  {
    title: "Buying once, keeping forever",
    category: "Living",
    excerpt:
      "Against disposability and for the objects that outlast trends, ownership cycles, and interior fashions.",
  },
];

export function getArticleBySlug(slug: string): JournalArticle | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
