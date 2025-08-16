import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { Buffer } from 'buffer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Adiciona flags futuras para o React Router
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false,
    },
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    Buffer: 'Buffer',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        {
          name: 'buffer',
          setup(build) {
            build.onResolve({ filter: /^buffer$/ }, () => {
              return { path: 'buffer', namespace: 'buffer' }
            })
            build.onLoad({ filter: /.*/, namespace: 'buffer' }, () => {
              return {
                contents: `
                  export const Buffer = ${JSON.stringify(Buffer)};
                  export default ${JSON.stringify(Buffer)};
                `,
                loader: 'js',
              }
            })
          },
        },
      ],
    },
  },
})
