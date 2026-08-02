// Glaze swatch colors, keyed by the exact Shopify variant title.
// The PDP renders round color swatches instead of text buttons only when
// *every* variant of a product has an entry here; otherwise it falls back
// to the plain text buttons (e.g. vase sizes, single-variant products).
export const GLAZE_SWATCHES: Record<string, string> = {
  'Ceramic Pattern Suit': '#C4A57B', // warm sand, banded stripes
  'Wave Pattern Suit': '#9D7B55', // rust-iron over a grey-green base
  'Gilding Suit': '#4E4033', // deep dark bronze
};
