/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Burnt Orange / Tangerine — Primary Accent
        brand: {
          50: '#FFF5EE',
          100: '#FFE8DB',
          200: '#FFCEB5',
          300: '#FFAA85',
          400: '#FF8254',
          500: '#FF5C28', // Primary burnt orange
          600: '#F04C18', // Primary CTA
          700: '#C7380E',
          800: '#9E2C0C',
          900: '#7A230A',
          950: '#420F03',
        },
        // Deep Charcoal / Black — Primary Background & Dark UI
        charcoal: {
          50: '#F6F7F9',
          100: '#ECEEF1',
          200: '#D5D8DF',
          300: '#B1B6C4',
          400: '#82889A',
          500: '#5D6274',
          600: '#424654',
          700: '#2D303B',
          800: '#1C1E26',
          850: '#16171E',
          900: '#111217',
          950: '#0A0B0E',
        },
        // Warm Ivory / Cream — Main Light Sections
        cream: {
          50: '#FDFAF4',
          100: '#FAF6ED',
          200: '#F5EFE0',
          300: '#ECE2CC',
          400: '#DFD1B3',
          500: '#CEBC98',
        },
        // Warm Beige — Editorial Cards & Warm Backgrounds
        beige: {
          50: '#FBF9F5',
          100: '#F5EFE6',
          200: '#EBE2D3',
          300: '#DFD3BF',
          400: '#CCA07A',
        },
        // Coral — Secondary Accent
        coral: {
          300: '#FFA094',
          400: '#FF8577',
          500: '#FF6B6B',
          600: '#F05353',
          700: '#D43838',
        },
        // Soft Lavender / Purple — Subtle Highlights
        lavender: {
          50: '#FAF7FF',
          100: '#F3EDFF',
          200: '#E7DBFF',
          300: '#CEB8FF',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
      },
    },
  },
  plugins: [],
}
