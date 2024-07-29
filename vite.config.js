import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3006, // Replace 3000 with your desired port number
        host: '0.0.0.0',
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'; // Split all node_modules into a separate chunk
                    }
                    // Add more conditions as needed for other large dependencies
                }
            }
        },
        chunkSizeWarningLimit: 4000, // Adjust this value as needed
    }
});
