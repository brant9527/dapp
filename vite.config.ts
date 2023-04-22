import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
// 分包
import visualizer from "rollup-plugin-visualizer";
import reactRefresh from "@vitejs/plugin-react-refresh";
import importToCDN, { autoComplete } from "vite-plugin-cdn-import";
import viteCompression from "vite-plugin-compression"

const path = require("path");
const postCssPxToRem = require("postcss-pxtorem");
const plugins = [];

// 打包生产环境才引入的插件
if (process.env.NODE_ENV === "production") {
  // 打包依赖展示
  plugins.push(
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    viteCompression({
      threshold: 10240, // the unit is Bytes
    }),
    // importToCDN({
    //   modules: [
    //     autoComplete('react'),
    //     autoComplete('react-dom')
    //     // {
    //     //   name: "web3",
    //     //   var: "Web3",
    //     //   path: `https://cdn.jsdelivr.net/npm/web3@1.5.2/dist/web3.min.js`,
    //     // },
    //     // {
    //     //   name: "react",
    //     //   var: "React",
    //     //   path: "https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js",
    //     // },
    //     // {
    //     //   name: "react-dom",
    //     //   var: "ReactDOM",
    //     //   path: `https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js`,
    //     // },
    //     // {
    //     //   name: "swiper",
    //     //   var: "swiper",
    //     //   path: "https://cdn.jsdelivr.net/npm/swiper@9.1.0/swiper-bundle.min.js",
    //     // },
    //     // autoComplete("react"),
    //     // autoComplete("react-dom"),
    //     // autoComplete("lodash"),
    //     // autoComplete("axios"),

    //     // {
    //     //   name: "lodash",
    //     //   var: "_",
    //     //   path: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
    //     // },
    //     // {
    //     //   name: "@walletconnect/web3-provider",
    //     //   var: "WalletConnectProvider",
    //     //   path: "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.6.7/dist/index.min.js",
    //     // },
    //   ],
    // }),
    // reactRefresh(),
    ...plugins,
  ],
  resolve: {
    alias: {
      // react:
      //   "https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js",
      // "react-dom":
      //   "https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react-dom.production.min.js",
      util: "util",
      web3: path.resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
      "@walletconnect/web3-provider": path.resolve(
        __dirname,
        "./node_modules/@walletconnect/web3-provider/dist/umd/index.min.js"
      ),
      "@": path.resolve(__dirname, "src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //   // 不打包依赖
  //     external: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  //     plugins: [
  //       // 不打包依赖映射的对象
  //       externalGlobals({
  //         react: 'React',
  //         'react-dom': 'ReactDOM',
  //         'react-router': 'ReactRouter',
  //         'react-router-dom': 'ReactRouterDOM',
  //         // axios: 'axios',

  //       })
  //     ]
  //  },

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 112.5, // 1rem的大小
          propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "./src/style/handle.scss";',
      },
    },
  },
});
