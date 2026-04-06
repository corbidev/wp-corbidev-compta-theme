import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  content: [
    './admin/**/*.{php}',
    './public/**/*.{php}',
    './core-ui/**/*.{php}',
    './assets/src/**/*.{vue,js,css,jsx}'
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
