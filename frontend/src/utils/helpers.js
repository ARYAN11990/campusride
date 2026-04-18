/**
 * Generate a deterministic, vibrant HSL color from a string (e.g. a user name).
 * The hue is derived from a simple hash so every name always gets the same color.
 */
export function getAvatarColor(name) {
  if (!name) return 'from-primary-400 to-accent-500'; // fallback gradient classes

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  // Return an inline-style-ready gradient (two complementary HSL stops)
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 75%, 55%), hsl(${(hue + 40) % 360}, 80%, 45%))`,
  };
}

/**
 * Render a price display: green "FREE" badge when price is 0, otherwise "₹X".
 */
export function formatPrice(price) {
  if (price === 0 || price === '0') {
    return { text: 'FREE', isFree: true };
  }
  return { text: `₹${price}`, isFree: false };
}
