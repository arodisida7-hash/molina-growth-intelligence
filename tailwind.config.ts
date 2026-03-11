import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#060816",
        foreground: "#F4F6FB",
        card: "#0C1124",
        border: "#1D2742",
        muted: "#8E9AB7",
        accent: {
          DEFAULT: "#5AD7C4",
          soft: "#12343C"
        },
        glow: {
          amber: "#F8B84E",
          blue: "#5E8BFF",
          rose: "#F27EA9"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(5, 8, 22, 0.45)",
        glow: "0 0 0 1px rgba(90, 215, 196, 0.18), 0 30px 80px rgba(7, 14, 32, 0.65)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(90,215,196,0.16), transparent 36%), radial-gradient(circle at top right, rgba(94,139,255,0.18), transparent 34%), linear-gradient(180deg, rgba(10,14,29,0.96), rgba(4,6,16,1))",
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-line": "pulseLine 2.8s ease-in-out infinite"
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Aptos"', '"Segoe UI"', "sans-serif"],
        display: ['"Space Grotesk"', '"Aptos Display"', '"Segoe UI"', "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
