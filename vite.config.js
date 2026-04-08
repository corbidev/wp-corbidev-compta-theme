import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [react()],

    root: '.',
    base: './',

    /**
     * ⚠️ IMPORTANT : ne forcer DEV que si mode=development
     */
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

      /**
       * ✅ Debug en dev build
       */
      sourcemap: isDev,
      minify: !isDev,

      rollupOptions: {
        input: {
          app: path.resolve(__dirname, 'assets/src/main.ts'),
          admin: path.resolve(__dirname, 'assets/src/admin/main.tsx'),
          'core-ui': path.resolve(__dirname, 'assets/src/core-ui/main.ts'),
          frontend: path.resolve(__dirname, 'assets/src/frontend/main.tsx'),
        },

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
        '@': path.resolve(__dirname, 'assets/src'),
        '@app': path.resolve(__dirname, 'assets/src'),
        '@utils': path.resolve(__dirname, 'assets/src/utils'),
        '@styles': path.resolve(__dirname, 'assets/src/styles'),
        '@core': path.resolve(__dirname, 'assets/src/core'),
        '@admin': path.resolve(__dirname, 'assets/src/admin'),
        '@core-ui': path.resolve(__dirname, 'assets/src/core-ui'),
        '@frontend': path.resolve(__dirname, 'assets/src/frontend'),
        '@transactions': path.resolve(__dirname, 'assets/src/features/transactions'),

        // Fix lib cassée
        'react-remove-scroll-bar/dist/es2015': path.resolve(
          __dirname,
          'node_modules/react-remove-scroll-bar/dist/es5'
        ),
      },
    },
  }
})
