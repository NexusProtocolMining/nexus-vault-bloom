import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom Nexus Tech colors
        nexus: {
          emerald: "hsl(var(--nexus-emerald))",
          "emerald-glow": "hsl(var(--nexus-emerald-glow))",
          "emerald-dark": "hsl(var(--nexus-emerald-dark))",
          cyan: "hsl(var(--nexus-cyan))",
          "cyan-glow": "hsl(var(--nexus-cyan-glow))",
          gold: "hsl(var(--nexus-gold))",
          "gold-soft": "hsl(var(--nexus-gold-soft))",
          carbon: "hsl(var(--nexus-carbon))",
          "carbon-light": "hsl(var(--nexus-carbon-light))",
          purple: "hsl(var(--nexus-purple))",
          blue: "hsl(var(--nexus-blue))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 30px hsl(160 84% 45% / 0.4), 0 0 60px hsl(175 80% 50% / 0.2)",
            borderColor: "hsl(160 84% 45% / 0.6)"
          },
          "50%": { 
            boxShadow: "0 0 50px hsl(160 84% 45% / 0.6), 0 0 100px hsl(175 80% 50% / 0.4)",
            borderColor: "hsl(160 84% 45% / 1)"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-3d": {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
          "50%": { transform: "translateY(-20px) rotateX(5deg)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "particle-float": {
          "0%, 100%": { 
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "0.3"
          },
          "33%": { 
            transform: "translateY(-30px) translateX(20px) scale(1.2)",
            opacity: "0.7"
          },
          "66%": { 
            transform: "translateY(-15px) translateX(-15px) scale(0.8)",
            opacity: "0.5"
          },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "cyber-glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-3d": "float-3d 8s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "particle-float": "particle-float 10s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "cyber-glitch": "cyber-glitch 0.3s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "nexus-gradient": "linear-gradient(135deg, hsl(160 84% 45%), hsl(175 80% 50%), hsl(200 90% 55%))",
        "gold-gradient": "linear-gradient(135deg, hsl(45 93% 58%), hsl(45 80% 70%))",
        "cyber-gradient": "linear-gradient(135deg, hsl(270 60% 55%), hsl(175 80% 50%))",
        "dark-gradient": "linear-gradient(180deg, hsl(220 25% 8%), hsl(220 20% 4%))",
      },
      boxShadow: {
        "nexus": "0 0 60px hsl(160 84% 45% / 0.5), 0 0 120px hsl(160 84% 45% / 0.2)",
        "nexus-lg": "0 0 100px hsl(160 84% 45% / 0.6), 0 0 200px hsl(160 84% 45% / 0.3)",
        "cyan": "0 0 40px hsl(175 80% 50% / 0.4)",
        "gold": "0 0 40px hsl(45 93% 58% / 0.4)",
        "glass": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "3d": "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 60px hsl(160 84% 45% / 0.15)",
        "3d-hover": "0 35px 70px -15px rgba(0, 0, 0, 0.7), 0 0 80px hsl(160 84% 45% / 0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
