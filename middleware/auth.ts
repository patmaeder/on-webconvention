import { useStore } from "~/store";
import { parse } from "set-cookie-parser";

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

  let fetchPayload = {};

  console.log(
    `Attempt to refresh expired session on ${
      process.server ? "server" : "client"
    }.`
  );

  /**
   * Ensure that cookie is sent with refresh request on server-side manually
   */
  if (process.server) {
    let accessToken = useCookie("Authorization");

    fetchPayload = {
      headers: {
        cookie: `Authorization=${accessToken.value}`,
      },
    };
  }

  let response = null;

  try {
    response = await $fetch.raw("/api/auth/refresh", {
      method: "POST",
      ...fetchPayload,
    });
  } catch (error) {
    console.log("Refresh failed.", error);
  }

  if (!response?._data.refreshed) {
    console.log(`Session could not be refreshed. Abort navigation.`);
    return navigateTo("/login");
  }

  let cookies = parse(response.headers.get("set-cookie"));
  let authorizationCookie = cookies.find(
    (cookie) => cookie.name === "Authorization"
  );

  console.log(authorizationCookie);

  if (authorizationCookie) {
    console.log("Set-Cookie header present in refresh response");

    accessToken.value = authorizationCookie.value;
  }

  console.log("Session could be refreshed.");
});
