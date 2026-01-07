/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        background: '#f8fafc', // Slate 50
        surface: '#ffffff', // White
        primary: '#4f46e5', // Indigo 600
        secondary: '#06b6d4', // Cyan 500
        accent: '#f43f5e', // Rose 500
        text: '#1e293b', // Slate 800
        'text-muted': '#64748b', // Slate 500
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%)', // Soft Indigo to Pink
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.3)',
      }
    },
  },
  plugins: [],
}
