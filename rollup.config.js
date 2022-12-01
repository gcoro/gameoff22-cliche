import copy from "rollup-plugin-copy"
import html from "rollup-plugin-html"
import htmlTemplate from "rollup-plugin-generate-html-template"
import commonjs from "@rollup/plugin-commonjs"
import clear from "rollup-plugin-clear"
import postcss from "rollup-plugin-postcss"
import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
// TODO import css from 'rollup-plugin-css-chunks';

const production = !process.env.ROLLUP_WATCH

export default {
    input: "src/main.js",
    output: {
        dir: "dist",
        format: "es",
        sourcemap: true,
        manualChunks: (id) => {
            if (id.includes("node_modules")) {
                return "vendor"
            }
        },
    },
    preserveEntrySignatures: false,
    plugins: [
        clear({
            targets: ["dist"],
            watch: true,
        }),
        resolve(),
        commonjs(),
        // production && terser(),
        html({
            include: "src/**/*.html",
            exclude: "src/index.html",
            htmlMinifierOptions: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                minifyJS: true,
            },
        }),
        postcss({
            // extract: true, // need configuration in order to inject in html and then separate by modules
            plugins: [],
        }),
        /* TODO
     css({
        // just consume the CSS files
        ignore: false,
        // generate sourcemap
        sourcemap: false,
        // inject `@import` directives
        injectImports: false,
        // name pattern for emitted secondary chunks
        chunkFileNames: 'chunk-[hash].css',
        // name pattern for emitted entry chunks
        entryFileNames: '[name]-[hash].css'
      }),
      */
        copy({
            targets: [{ src: "static/assets/**/*", dest: "dist/assets" }],
        }),
        htmlTemplate({
            template: "src/index.html",
            target: "dist/index.html",
            attrs: ["type='module'"],
        }),
    ],
}
