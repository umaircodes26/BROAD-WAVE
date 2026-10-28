import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@user_uploaded': fileURLToPath(new URL('./src/assets/media', import.meta.url)),
            '@images': fileURLToPath(new URL('./src/assets/media', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        host: true,
        fs: {
            allow: [
                fileURLToPath(new URL('.', import.meta.url)),
            ],
        },
    },
});