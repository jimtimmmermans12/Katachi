---
name: katachi-brand
description: KATACHI brand system for all store, marketing, and copy work. Use this skill whenever you build or edit any KATACHI page, component, product description, ad, email, social caption, or any customer-facing text or UI — even when the request doesn't name the brand explicitly. It defines the voice, visual language, copywriting rules, and product framing so everything stays consistent without re-explaining the brand each time.
---

# KATACHI Brand System

KATACHI (形 — Japanese for "form/shape") is a premium, Japanese-inspired minimalist homeware brand. The job of this skill is to make every piece of work feel like it came from the same quiet, considered hand: calm, confident, and uncluttered. When in doubt, choose restraint over decoration.

**Tagline:** *Own less. Choose well.*

**Reference world (the feeling to aim for):** Aesop, COS, The Row, Toast. Spacious, editorial, understated luxury. Never loud, never salesy, never "dropship."

**Market note:** The brand is English-language and international. Paid ads currently start in NL/BE, but on-site copy and product content stay in English unless explicitly told otherwise.

---

## Voice & Tone

Write like a knowledgeable friend with impeccable taste who never tries too hard.

- **Calm and declarative.** Short sentences. Let white space do work. No hype words ("amazing," "must-have," "game-changer," "revolutionary").
- **Concrete over abstract.** Name the material, the weight, the ritual. "Stoneware that warms in your hands" beats "premium quality you'll love."
- **Quietly confident.** State, don't oversell. No exclamation marks in body copy. At most one, rarely, in a headline.
- **Unhurried.** It's fine to leave a thought spare. Resist filling every line with a benefit.
- **No emoji** in product copy, page copy, or email. Sparingly acceptable in social captions only if the platform demands it.

**Off-limits:** urgency manipulation ("Only 2 left!! Buy NOW"), fake scarcity, generic SEO mush, stacked adjectives, and anything that reads like a template. If a line could appear on any random Shopify store, rewrite it.

### Voice examples

**Product intro — do this:**
> The Shizen Matcha Bowl is made to be held. Wide enough to whisk, heavy enough to feel grounded, finished in three muted glazes named for the seasons.

**Not this:**
> Our AMAZING premium matcha bowl is a MUST-HAVE for any tea lover! High quality and beautiful, you'll absolutely love it. Order yours today!

**CTA — do this:** `Add to cart` · `Explore the collection` · `Discover KATACHI`
**Not this:** `BUY NOW!!!` · `Grab yours before they're gone!`

---

## Visual System

**Always defer to the live design tokens in the codebase first** (check `tailwind.config.*` and `app/globals.css` / CSS variables). The values below are the canonical reference — if the code already defines them, match the code; if a value is missing, introduce it using these names.

### Color palette (five named tones)

The palette is deliberately small. Backgrounds are light and warm; ink is near-black, not pure black; one metallic accent used sparingly.

| Name | Meaning | Role | Reference hex |
|------|---------|------|---------------|
| **Shiro** (白) | white | Primary background, negative space | `#F7F5F2` (warm off-white) |
| **Tsuchi** (土) | earth | Secondary surfaces, muted blocks | `#C4B9A8` |
| **Sumi** (墨) | ink | Text, headings, near-black | `#2C2C2C` |
| **Mori** (森) | forest | Accent / depth, used rarely | `#4A5240` |
| **Kin** (金) | gold | Single metallic accent, used very sparingly | `#B8A06A` |

Rules:
- Most of any layout is **Shiro** + **Sumi**. Color is the exception, not the rule.
- **Kin** is a seasoning — fine lines, a small detail, never a fill behind text and never a button background on a whole page.
- Avoid pure white (`#FFF`) and pure black (`#000`). Use Shiro and Sumi.
- No gradients, no drop shadows heavier than a whisper. Flat, clean, editorial.

### Typography

- **Display / headings:** Cormorant Garamond — light or regular weight, generous letter-spacing on small caps, large sizes for impact.
- **Body / UI:** DM Sans — clean, neutral, comfortable line-height (≈1.6).
- Pair them as: serif for the *idea* (hero lines, product names, section titles), sans for the *information* (descriptions, specs, nav, buttons).
- Headlines can be lowercase or small-caps for an editorial feel. Avoid ALL-CAPS shouting except tiny labels with letter-spacing.

### Layout & spacing

- **Generous whitespace is the brand.** When unsure, add margin, don't remove it.
- Large, uncropped product imagery on calm backgrounds. One subject, breathing room.
- Grids are simple and symmetric. Align to a clear baseline. No busy borders or boxes.
- Motion, if any, is slow and subtle (gentle fades, never bounces or spins).

---

## Product Framing

Active products and how to talk about them:

- **Shizen Matcha Bowl** (€44.99) — three variants with Japanese colour names; frame around the ritual of whisking and the feel in the hand.
- **Shiro Ceramic Vase** (S / M / L) — frame around form, silhouette, and the single stem it's made to hold.
- **Kaze Sake Set** (€34.99) — *slated for replacement*; a Japanese incense set is the leading candidate. Don't lean into this product for new evergreen content.

Product-name convention: real or evocative Japanese words (Shizen 自然 nature, Shiro 白 white, Kaze 風 wind). Keep the pattern when naming new products — one Japanese word that captures the object's essence, with a short gloss available but not forced into the title.

### Product description template

Keep descriptions to three short movements. No spec-dumping up top.

```
[One-line essence — what it is and the feeling, in a single calm sentence.]

[2–3 sentences on material, making, and the ritual or moment it belongs to.]

[Short, honest details: material, dimensions, care. Plain language, no fluff.]
```

**Example (Shizen Matcha Bowl):**
> Made to be held.
>
> A wide stoneware chawan, weighted to sit calmly in the palm and roomy enough to whisk a proper bowl of matcha. Each piece is finished in one of three muted seasonal glazes, so no two feel quite alike.
>
> Stoneware. ⌀12 cm, 350 ml. Hand-wash, dry well.

---

## Page & Component Conventions (for build work)

When building or editing the store (headless Next.js on Vercel, Shopify Storefront API):

- Match existing components and the established premium minimalist UI — don't introduce a new visual language mid-site.
- Use the named color tokens and the two typefaces above; pull from the live Tailwind/CSS config rather than hardcoding stray hex values.
- Buttons: quiet. Solid Sumi on Shiro, or outlined. No loud accent-colour fills, no uppercase shouting, no harsh shadows.
- Copy inside UI (empty cart, error states, microcopy) follows the same voice — calm and human. Empty cart: *"Your cart is quiet for now."* not *"Your cart is empty!"*
- Keep accessibility sane: real contrast between Sumi text and Shiro background, legible sizes, focus states.
- Prefer fewer, larger images over dense galleries.

---

## Quick Checklist Before Shipping Any KATACHI Output

1. Would this look at home next to Aesop / COS / The Row? If it feels loud or generic, rework it.
2. Voice: calm, concrete, no hype words, no fake urgency, (almost) no exclamation marks, no emoji in core copy.
3. Visuals: Shiro + Sumi dominate; Kin only as a fine accent; whitespace is generous; Cormorant for ideas, DM Sans for info.
4. Product copy follows the three-movement template; names follow the one-Japanese-word pattern.
5. Nothing on the page could be dropped onto a random Shopify store unchanged.
