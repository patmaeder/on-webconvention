import { defineNuxtConfig } from "nuxt";
import "dotenv/config";
import fs from "fs";

const viteConfig = {
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
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  server: {},
  vite: viteConfig,
});
