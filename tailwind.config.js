import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  content: [
    './admin/**/*.php',
    './public/**/*.php',
    './assets/src/**/*.{ts,tsx,js,css}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['inherit', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [tailwindcssAnimate],
}
