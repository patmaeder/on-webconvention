import { defineNuxtConfig } from "nuxt";
import "dotenv/config";
import fs from "fs";

const viteConfig = fs.existsSync(".ddev/ssl/certs") ? {
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
} : null;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  server: {},
  runtimeConfig: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  vite: viteConfig
});