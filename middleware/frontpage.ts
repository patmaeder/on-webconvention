import { defineNuxtRouteMiddleware, navigateTo } from "#app";

/**
 * When the user requests the frontpage he will be redirected to event-site
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (from.path === "/") {
    return navigateTo("/event-site");
  }
});
