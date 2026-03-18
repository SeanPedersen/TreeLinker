import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import manifest from './src/manifest';
import pkg from './package.json';

const target = process.env.TARGET ?? 'chrome';

export default defineConfig(({ mode }) => ({
    plugins: [react(), crx({ manifest })],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    define: {
        __ENV__: JSON.stringify(mode === 'production' ? 'production' : 'development'),
        __VERSION__: JSON.stringify(pkg.version),
        __TARGET__: JSON.stringify(target),
    },
    css: {
        preprocessorOptions: {
            less: { javascriptEnabled: true },
        },
    },
    build: {
        outDir: 'extension',
        target: 'chrome96',
    },
}));
