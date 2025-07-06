/// <reference types="vitest" />

import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React libraries
                    'react-core': ['react', 'react-dom'],
                    // Routing
                    'router': ['react-router-dom'],
                    // Data fetching
                    'data': ['axios'],
                    // MUI core components
                    'mui-core': ['@mui/material', '@mui/system'],
                    // MUI icons (often large)
                    'mui-icons': ['@mui/icons-material'],
                }

            }
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ["./vitest.setup.ts",],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    }
})