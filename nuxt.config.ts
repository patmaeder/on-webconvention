import { defineNuxtConfig } from "nuxt";
import "dotenv/config";

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
});
