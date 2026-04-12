import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [react()],

    root: '.',
    base: './',

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    optimizeDeps: {
      exclude: ['@wordpress/i18n'],
    },

    build: {
      target: 'es2018',
      chunkSizeWarningLimit: 1000,
      outDir: 'assets/dist',
      emptyOutDir: true,
      manifest: true,

      sourcemap: isDev,
      minify: !isDev,

      rollupOptions: {
        /**
         * 🔥 ENTRÉES CORRIGÉES
         */
        input: {
          frontend: path.resolve(__dirname, 'assets/src/app/frontend.tsx'),
          admin: path.resolve(__dirname, 'assets/src/app/admin.tsx'),
        },

        /**
         * WordPress externals
         */
        external: (id) => id.startsWith('@wordpress/'),

        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',

          globals: {
            '@wordpress/i18n': 'wp.i18n',
          },

          inlineDynamicImports: false,
        },
      },
    },

    resolve: {
      alias: {
        /**
         * 🔥 BASE
         */
        '@': path.resolve(__dirname, 'assets/src'),

        /**
         * 🔥 CLEAN aliases
         */
        '@app': path.resolve(__dirname, 'assets/src/app'),
        '@features': path.resolve(__dirname, 'assets/src/features'),
        '@components': path.resolve(__dirname, 'assets/src/components'),
        '@shared': path.resolve(__dirname, 'assets/src/shared'),
        '@styles': path.resolve(__dirname, 'assets/src/styles'),

        /**
         * 🔧 FIX LIB (ok)
         */
        'react-remove-scroll-bar/dist/es2015': path.resolve(
          __dirname,
          'node_modules/react-remove-scroll-bar/dist/es5'
        ),
      },
    },
  }
})
