export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#35C85A',
        gold: '#F5B700',
        page: '#F8F9FA',
        text: '#0A0A0A',
        muted: '#4A4A4A',
        footer: '#061A33',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(10, 10, 10, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
