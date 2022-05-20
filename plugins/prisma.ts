import { PrismaClient } from "@prisma/client";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.server) {
    return;
  }

  const prisma = new PrismaClient();

  // bind prisma client to nuxt via $prisma
  nuxtApp.provide("prisma", prisma);

  //  when NUXT is done =>
  //  await prisma.$disconnect() to avoid multiple PrismaClient instance
});
