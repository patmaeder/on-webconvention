import { useStore } from "~/store";
import { parse } from "set-cookie-parser";
import { abortNavigation } from "#app";

const refreshSession = async (fetchOptions = {}) => {
  let response = await $fetch.raw("/api/auth/refresh", {
    method: "POST",
    ...fetchOptions,
  });

  if (!response?._data.refreshed) {
    throw new Error(`Refreshing endpoint did not confirm action.`);
  }

  return response;
};

/**
 * This method is used to refresh the session on the server side
 * Cookie sent by api-route through Set-Cookie-Header is forwarded to client
 */
const refreshSessionServerSide = async () => {
  let accessToken = useCookie("Authorization");

  let response = await refreshSession({
    headers: {
      cookie: `Authorization=${accessToken.value}`,
    },
  });

  let cookies = parse(response.headers.get("set-cookie"));
  let authorizationCookie = cookies.find(
    (cookie) => cookie.name === "Authorization"
  );

  if (!authorizationCookie) {
    throw new Error("Server-side refresh did not deliver a set-cookie header.");
  }

  accessToken.value = authorizationCookie.value;
};

/**
 * Session refreshing works the following way:
 *  1) Check whether user is already logged in, else redirect to login-page
 *  2) Check if session is still valid, then forward to requested page
 *  3) Try to refresh session on targeted platform client.
 *  4) Session could not be refreshed? Show login-page
 *
 *  It is important to check whether the session can be renewed on server to avoid sending sensitive information to not-renewable client.
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore();

  if (!store.session) {
    console.log("[Auth]", `User is not logged in.`);
    return navigateTo("/login");
  }

  const userIsAuthenticated = store.session.expiresIn > Date.now();

  console.log(
    "[Auth]",
    "Session will expire at",
    new Date(store.session?.expiresIn)
  );

  if (userIsAuthenticated) {
    console.log(
      "[Auth]",
      `Session is still valid. Continue navigation to ${to.fullPath}.`
    );
    return;
  }

  // page is rendered on server, prevent sending sensitive information
  if (process.server) {
    abortNavigation();
  }

  try {
    console.log("[Auth]", `Attempt to refresh expired session on client.`);

    await refreshSession();
  } catch (error) {
    console.log(
      "[Auth]",
      `Session could not be refreshed. Abort navigation. ${error}`
    );
    return navigateTo("/login");
  }
});
