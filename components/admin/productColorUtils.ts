export const DEFAULT_HEX = "#1a1a1a";

const NAMED_COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  blue: "#2563eb",
  navy: "#1e3a5f",
  red: "#dc2626",
  green: "#16a34a",
  grey: "#6b7280",
  gray: "#6b7280",
  charcoal: "#36454f",
  beige: "#d4c4a8",
  brown: "#78350f",
  tan: "#d2b48c",
  cream: "#fffdd0",
  ivory: "#fffff0",
  pink: "#ec4899",
  purple: "#7c3aed",
  orange: "#ea580c",
  yellow: "#eab308",
  gold: "#ca8a04",
  silver: "#c0c0c0",
  olive: "#556b2f",
  maroon: "#800000",
  teal: "#0d9488",
  cyan: "#06b6d4",
  indigo: "#4f46e5",
  default: "#9ca3af",
};

export function resolveColorHex(hex: string, name: string): string {
  const trimmedHex = hex?.trim() ?? "";
  const pickerWasUsed =
    trimmedHex &&
    /^#[0-9A-Fa-f]{3,8}$/i.test(trimmedHex) &&
    trimmedHex.toLowerCase() !== DEFAULT_HEX;

  if (pickerWasUsed) {
    return expandHex(trimmedHex);
  }

  const key = name.trim().toLowerCase();
  if (NAMED_COLOR_MAP[key]) return NAMED_COLOR_MAP[key];

  if (typeof document !== "undefined" && key) {
    const fromCss = cssColorNameToHex(key);
    if (fromCss) return fromCss;
  }

  return pickerWasUsed ? expandHex(trimmedHex) : trimmedHex || DEFAULT_HEX;
}

function expandHex(hex: string): string {
  if (/^#[0-9A-Fa-f]{3}$/i.test(hex)) {
    const h = hex.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  return hex;
}

function cssColorNameToHex(name: string): string | null {
  const el = document.createElement("div");
  el.style.color = name;
  el.style.display = "none";
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color;
  document.body.removeChild(el);

  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return null;

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
