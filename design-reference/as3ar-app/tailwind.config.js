/** @type {import('tailwindcss').Config} */
// Design tokens sourced from the "أسعار" identity guide (design-brief-price-platform.md).
// The Syrian-flag hierarchy: green header -> white body -> ink footer, with the
// three red stars reserved as the single signature element.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: '#007A3D',        // primary buttons, header, price drops, "lowest price"
        'green-deep': '#00532A', // hover, secondary footer, titles on green
        'green-tint': '#E6F2EB', // savings-badge bg, best-value highlight
        ink: '#0E1311',          // body text, footer, dark surfaces
        paper: '#FFFFFF',        // content background
        surface: '#F4F6F5',      // page background, striped tables
        line: '#DDE3E0',         // borders and dividers
        muted: '#6B7772',        // secondary text, dates, timestamps
        star: '#CE1126',         // star red — RESTRICTED use (loss / time running out)
        'star-tint': '#FDECEE',  // warning / countdown bg
      },
      fontFamily: {
        heading: ['Tajawal', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        field: '8px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,19,17,.06)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' }, // row is duplicated, so 50% loops seamlessly (RTL-aware)
        },
        pulse2: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.4', transform: 'scale(.75)' },
        },
      },
      animation: {
        ticker: 'ticker 38s linear infinite',
        pulse2: 'pulse2 1.7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
