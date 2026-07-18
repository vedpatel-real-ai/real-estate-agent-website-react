const palette = {
  bg: "F5F1EA",
  fg: "2F3A36",
  accent: "C8A96A",
};

export function placeholderImage(label, width = 1200, height = 800) {
  const text = encodeURIComponent(label);
  return `https://placehold.co/${width}x${height}/${palette.bg}/${palette.fg}?text=${text}`;
}

export const demoLogo = placeholderImage("DreamSpace Properties", 800, 400);

