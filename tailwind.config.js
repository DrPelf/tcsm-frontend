/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9d9d02",
          alt: "#F0F0E4",
          dark: "#666639",
          50: "#f5f7f2",
          100: "#e8ede1",
          200: "#d1dbc3",
          300: "#b3c29d",
          400: "#94a677",
          500: "#798c5c",
          600: "#5c6c45", // Main olive color
          700: "#4a5a35",
          800: "#3d4a2e",
          900: "#343f29",
          950: "#1a2114",
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
        danger: {
          DEFAULT: "#C8421B",
        },
        olive: {
          600: "#5D6A4D",
          700: "#4D6A4D", 
          800: "#3D5A3D",
        },
        yellow: {
          600: "#D4A76A",
        },
        blue: {
          600: "#4A6FA5",
        },
        green: {
          600: "#2E8B57",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        'domine': ['Domine', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      maxWidth: {
        '7.5xl': '84rem', // 1344px - right between 7xl (1280px) and 8xl (1408px)
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  safelist: [
    'h-64',
    'w-3/5',
    'w-4/5',
    'w-2/5',
    'w-1/2',
    'w-1/3',
  ],
};
