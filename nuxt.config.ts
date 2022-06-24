import { defineNuxtConfig } from "nuxt";
import "dotenv/config";
import fs from "fs";

const HTTPS_ENABLED = fs.existsSync(".ddev/ssl/certs");

process.env["BASE_URL"] = HTTPS_ENABLED
  ? "https://localhost:3000"
  : "http://localhost:3000";

const viteConfig = HTTPS_ENABLED
  ? {
      server: {
        hmr: {
          protocol: "wss",
          host: "localhost",
        },
        https: {
          key: fs.readFileSync(".ddev/ssl/certs/master.key"),
          cert: fs.readFileSync(".ddev/ssl/certs/master.crt"),
        },
      },
    }
  : null;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ["@pinia/nuxt"],
  build: {
    transpile: ["troisjs"],
  },
  runtimeConfig: {
    public: {
      SFU_HOST: process.env.SFU_HOST,
    },
  },
  css: ["@/assets/styles/index.scss"],
  ssr: true,
  vite: viteConfig,
});
