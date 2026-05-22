import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "primary-fixed": "var(--primary-fixed)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "inverse-primary": "var(--inverse-primary)",

        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "secondary-fixed": "var(--secondary-fixed)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",

        tertiary: "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",

        background: "var(--background)",
        "on-background": "var(--on-background)",

        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-tint": "var(--surface-tint)",

        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",

        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",

        error: "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      spacing: {
        "gutter-mobile": "16px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "24px",
        gutter: "24px",
        "gutter-desktop": "32px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "section-gap": "120px",
        "container-max-width": "1440px",
        "sidebar-width": "280px",
      },
      fontFamily: {
        sans: ["var(--font-hanken-grotesk)", "sans-serif"],
        grotesk: ["var(--font-hanken-grotesk)", "sans-serif"],
        serif: ["var(--font-eb-garamond)", "serif"],
        garamond: ["var(--font-eb-garamond)", "serif"],
      },
      fontSize: {
        "display-hero": [
          "80px",
          { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "300" },
        ],
        "display-hero-mobile": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" },
        ],
        "headline-lg": [
          "40px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-caps": [
          "12px",
          { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" },
        ],
      },
      maxWidth: {
        "container-max-width": "1440px",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
