import { useStore } from "~/store";

export default defineNuxtRouteMiddleware(async (to) => {
  const store = useStore();

  if (!store.session) {
    console.log(`User is not logged in.`);
    return navigateTo("/login");
  }

  const userIsAuthenticated = store.session.expiresIn > Date.now();

  if (process.client) {
    console.log("Session will expire at", new Date(store.session?.expiresIn));
  }

  if (userIsAuthenticated) {
    console.log(
      `Session is still valid. Continue navigation to ${to.fullPath}.`
    );
    return;
  }

  if (process.server) {
    console.log(
      `Attempt to refresh expired session on ${
        process.server ? "server" : "client"
      }.`
    );

    // refresh here
  }

  let refreshed = await $fetch("/api/auth/refresh", {
    method: "POST",
  })
    .then((res) => res.refreshed)
    .catch((error) => console.log("Refresh failed.", error));

  if (!refreshed) {
    console.log(`Session could not be refreshed. Abort navigation.`);
    return navigateTo("/login");
  }

  console.log("Session could be refreshed.");
});
