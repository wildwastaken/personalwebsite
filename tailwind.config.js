/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FFFCF0',
          dim: '#F2F0E5',
          dark: '#161615',
          'dark-dim': '#1C1B1A',
        },
        ink: {
          DEFAULT: '#100F0F',
          muted: '#6F6E69',
          border: '#E6E4D9',
          dark: '#CECDC3',
          'dark-muted': '#878580',
          'dark-border': '#282726',
        },
      },
      fontFamily: {
        serif: [
          'Charter',
          'Iowan Old Style',
          'Palatino',
          'Newsreader',
          'Georgia',
          'Cambria',
          'serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
