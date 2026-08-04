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
      "I kept losing my mornings to the phone. A bowl of matcha — made badly at first — gave them back.",
    date: "2026-06-12",
    readingTime: "4 min read",
    content: [
      "For most of last winter my mornings belonged to my phone. I would tell myself I was checking the time, and twenty minutes later I would be standing at the kitchen counter, cold coffee, reading about something I have since completely forgotten. I don't think my situation was unusual. That was the annoying part — it wasn't even a dramatic problem. It was just a slow leak.",
      "What changed things was not discipline. It was a bowl of matcha, made badly. A friend had brought me a chawan and a bamboo whisk from a trip to Japan, and the first weeks my foam was thin, the taste bitter, the whole thing vaguely embarrassing to do alone in a quiet kitchen. But whisking takes two hands. That detail turned out to matter more than any intention I had ever set: for three minutes each morning, holding the phone was physically impossible.",
      "Slowly the thing stopped being a technique to improve and became a moment I looked forward to. Water just off the boil. The dry click of the whisk against the rim, then the softer sound as the foam builds. I am not a ceremonial person — nobody who knows me would accuse me of that — but I began to understand why the Japanese tea tradition treats the bowl as a participant rather than equipment. The weight in my palms set a tempo. I couldn't rush it, and after a while I noticed I had stopped wanting to.",
      "I also noticed how much the object itself was doing. On dark mornings the glaze looks almost grey; by March, in earlier light, it had turned faintly green. The bowl gave my eyes one place to rest, the way the whisking gave my hands one thing to do. I had read about attention as if it were an idea. It turns out to live mostly in the wrists.",
      "I won't pretend the ritual fixed my relationship with the phone — it still wins most evenings. But the first fifteen minutes of the day are mine now, and that changes the taste of the hours that follow. Days that begin unhurried seem to stay wider, somehow, even when they get busy.",
      "If you want to try this, my honest advice is: don't buy a meditation course, and don't start with a philosophy. Pick one moment you already repeat daily — the first tea, watering the plants, setting the table — and give it an object that asks for both hands. The hands will do the rest.",
    ],
  },
  {
    slug: "on-the-weight-of-a-good-bowl",
    title: "On the weight of a good bowl",
    category: "Objects",
    excerpt:
      "The bowl I bought at a Kyoto morning market has survived three moves. Almost everything lighter is gone.",
    date: "2026-07-08",
    readingTime: "5 min read",
    content: [
      "The oldest thing in my kitchen is a stoneware bowl I bought at a morning market in Kyoto, years ago, from a maker whose name I never managed to write down properly. It has a chip at the foot from the second of the three moves it has survived. Nearly everything I owned back then — lighter, cheaper, easier to carry — is gone. The heavy bowl stayed. I have been thinking about why.",
      "When I finally picked it up from the market table, after circling it twice like you do, the weight was the thing that decided it. Not the glaze, which I barely remember looking at. The bowl was denser than it looked, settled into my palm as if it had opinions about staying there, and some old part of my brain simply said: this one is real.",
      "I've since learned to trust that instinct when I'm choosing pieces, and to distrust photographs. A photograph reports what an object looks like, and looks are the least honest part of a ceramic's character. Two bowls that appear identical on a screen can be strangers in the hand — one hollow and apologetic, one substantial. When we consider work by a new maker, the first thing I do when the sample box arrives is unpack it without reading anything, just to hold each piece. The notes come after. The hands vote first.",
      "Weight is information, if you listen to it. It tells you about the wall of clay the piece was thrown from, and about a maker who didn't thin the form to save material. My Kyoto bowl also taught me about temperature: stoneware warms slowly and holds it, so the bowl seems to take part in a meal rather than just contain it. The thin mug I once got free with something — long gone now — was always exactly room temperature. Inert is the word.",
      "My favourite detail on the old bowl is where the glaze stops. The inside is glass-smooth; at the foot, the clay is bare and rough, and you can feel the exact line where one life ends and the other begins. I run my thumb over it without noticing I'm doing it. No product page has ever told me as much as that centimetre of transition.",
      "None of this is an argument for heaviness as a style — a sake cup shouldn't feel like a brick. It's an argument for honesty. An object should feel like what it is. When form, material and weight agree with each other, your hand relaxes, because it has been told the truth.",
      "So this is the test I've ended up with, and you're welcome to it: before you buy the next thing for your table, close your eyes for a second while you hold it. Eyes are easily persuaded. Hands are harder to fool — mine chose this bowl three kitchens ago, and they were right.",
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
