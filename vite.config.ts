import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    server: {
        proxy: {
            '/gamecene': {
                target: 'https://games-list.zuiniuyouxi.com/', // 线上目标服务器
                changeOrigin: true,
            },
        },
    },
    build: {
        sourcemap: true,
        minify: true,
        assetsInlineLimit: 100 * 1024,
        // lib: {
        //     entry: "src/index.ts",
        //     name: "BeeGameFramework",
        //     fileName: (format) => `bee-game-framework-${format}.js`,
        // }
    },
    plugins: [
        vue(),
        vueJsx(),
        // VueDevTools(),
        // sentryVitePlugin({
        //     org: "bee",
        //     project: "game-framework",
        //     url: "https://sentry2.bee.com",
        //     debug: true,
        //     sourcemaps: {
        //         ignore: ["node_modules", "vite.config.ts"],
        //     },
        //     release: {
        //         name: process.env.GIT_TAG || "debug",
        //     },
        //
        //     authToken: "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",
        // }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
