import { useStore } from "~/store";
import { useCookie } from "h3";
import { parseSessionToken } from "~/server/auth";

/**
 * This plugin will populate the client-side store with the jwt accessToken payload, which is not accessible through client-side scripts
 */

export default defineNuxtPlugin(async (nuxt) => {
  const store = useStore();

  const sessionCookie = useCookie(nuxt.ssrContext.req, "Authorization");
  const decodedToken = await parseSessionToken(sessionCookie);

  if (!decodedToken.authenticated) {
    console.log("Error: User is not authenticated.");
    return;
  }

  store.updateSession({
    name: decodedToken.name,
    email: decodedToken.email,
    expiresIn: decodedToken.expiresIn,
  });

  console.log(
    `Updated session from server-side function for user <${decodedToken.email}>`
  );
});
