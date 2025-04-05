import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "var(--theme-ui-colors-alphaDark)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--theme-ui-colors-alpha)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        text: "var(--theme-ui-colors-text)",
        article: "var(--theme-ui-colors-article)",
        heading: "var(--theme-ui-colors-heading)",
        alphaLighter: "var(--theme-ui-colors-alphaLighter)",
        alphaLight: "var(--theme-ui-colors-alphaLight)",
        alpha: "var(--theme-ui-colors-alpha)",
        alphaDark: "var(--theme-ui-colors-alphaDark)",
        alphaDarker: "var(--theme-ui-colors-alphaDarker)",
        betaLighter: "var(--theme-ui-colors-betaLighter)",
        betaLight: "var(--theme-ui-colors-betaLight)",
        beta: "var(--theme-ui-colors-beta)",
        betaDark: "var(--theme-ui-colors-betaDark)",
        betaDarker: "var(--theme-ui-colors-betaDarker)",
        omegaLighter: "var(--theme-ui-colors-omegaLighter)",
        omegaLight: "var(--theme-ui-colors-omegaLight)",
        omega: "var(--theme-ui-colors-omega)",
        omegaDark: "var(--theme-ui-colors-omegaDark)",
        omegaDarker: "var(--theme-ui-colors-omegaDarker)",
        successLight: "var(--theme-ui-colors-successLight)",
        success: "var(--theme-ui-colors-success)",
        errorLight: "var(--theme-ui-colors-errorLight)",
        error: "var(--theme-ui-colors-error)",
        white: "var(--theme-ui-colors-white)",
        flexiBackground: "var(--theme-ui-colors-background)",
        contentBg: "var(--theme-ui-colors-contentBg)",
        headerBg: "var(--theme-ui-colors-headerBg)",
        footerBg: "var(--theme-ui-colors-footerBg)",
        mute: "var(--theme-ui-colors-mute)",
        highlight: "var(--theme-ui-colors-highlight)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        card: "1px 1px 5px 0 rgba(1, 1, 1, 0.05)",
        hoveredCard:
          "0px 2px 4px rgba(46,41,51,0.08), 0px 5px 10px rgba(71,63,79,0.16)",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover"],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
