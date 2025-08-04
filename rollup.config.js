// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from 'rollup-plugin-postcss';
import url from "@rollup/plugin-url";
// import rebase from "rollup-plugin-rebase";
// import image from "@rollup/plugin-image";
import copy from "rollup-plugin-copy";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        makeAbsoluteExternalsRelative: true,
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            postcss({
                extensions: ['.css', '.scss'], // Support both CSS and SCSS
                use: ['sass'],                // Use the Sass compiler for SCSS files
                inject: true,                 // Inject styles into JavaScript
                minimize: true,
                // plugins: [
                //     require('postcss-url')({
                //         url: 'copy', // Copy images to the output directory
                //         useHash: false, // Optionally append a hash to the file name
                //         assetsPath: 'dist/assets', // Directory for copied assets
                //     }),
                // ],
            }),
            // url({
            //     include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'], // Process these image types
            //     limit: 0, // Force assets to be copied, not inlined
            //     destDir: 'dist/assets', // Output directory for assets
            // }),
            // rebase({
            //     assetFolder: 'assets',
            //     keepName: true,
            // }),
            // image(),

            copy({
                targets: [
                    { src: 'src/assets/*', dest: 'dist/assets' }, // Copy assets manually
                ],
            }),
        ],
        external: ["react", "react-dom"],
    },
    {
        input: "src/index.ts",
        output: [{ file: "dist/types.d.ts", format: "es" }],
        plugins: [dts.default()],
    },
];