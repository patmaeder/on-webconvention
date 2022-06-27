import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useStore } from "~/store";

/**
 * When the user requests the frontpage he will be redirected to event-site
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore();

  if (!store.session) {
    return navigateTo("/login");
  }

  return navigateTo("/event-site");
});
