import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
    }
});
