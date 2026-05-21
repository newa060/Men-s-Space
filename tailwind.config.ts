import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        primary: "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#1b1b1b",
        "on-primary-container": "#848484",
        "primary-fixed": "#e2e2e2",
        "primary-fixed-dim": "#c6c6c6",
        "on-primary-fixed": "#1b1b1b",
        "on-primary-fixed-variant": "#474747",
        "inverse-primary": "#c6c6c6",

        secondary: "#5e5e5e",
        "on-secondary": "#ffffff",
        "secondary-container": "#e3e2e2",
        "on-secondary-container": "#646464",
        "secondary-fixed": "#e3e2e2",
        "secondary-fixed-dim": "#c7c6c6",
        "on-secondary-fixed": "#1b1c1c",
        "on-secondary-fixed-variant": "#464747",

        tertiary: "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#1a1c1c",
        "on-tertiary-container": "#838484",
        "tertiary-fixed": "#e2e2e2",
        "tertiary-fixed-dim": "#c6c6c7",
        "on-tertiary-fixed": "#1a1c1c",
        "on-tertiary-fixed-variant": "#454747",

        background: "#f9f9f9",
        "on-background": "#1a1c1c",

        surface: "#f9f9f9",
        "on-surface": "#1a1c1c",
        "surface-variant": "#e2e2e2",
        "on-surface-variant": "#4c4546",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-tint": "#5e5e5e",

        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f0f1f1",

        outline: "#7e7576",
        "outline-variant": "#cfc4c5",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "0rem",
        sm: "0rem",
        md: "0rem",
        lg: "0rem",
        xl: "0rem",
        "2xl": "0rem",
        full: "9999px",
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "section-gap": "120px",
        "container-max-width": "1440px",
      },
      fontFamily: {
        sans: ["var(--font-hanken-grotesk)", "sans-serif"],
        grotesk: ["var(--font-hanken-grotesk)", "sans-serif"],
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
