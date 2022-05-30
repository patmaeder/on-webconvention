import { Roles, useServer } from "~/server";
import { CompatibilityEvent, sendError, sendRedirect, useCookie } from "h3";
import jwt from "jsonwebtoken";
import { refreshSessionToken, setSessionToken } from "~/server/auth";

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const sessionToken = useCookie(event, "Authorization");

  console.log("received cookie", sessionToken);

  const { prisma } = await useServer();

  if (!sessionToken) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Refreshing process requires a token.",
      })
    );
    return;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(sessionToken, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
  } catch (error) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );

    return;
  }

  const tokenIsExpired = decodedToken.exp <= Date.now();

  if (!tokenIsExpired) {
    console.log(
      `Token is still valid and not expired for user <${decodedToken.email}>. Preventing refresh.`
    );

    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );

    return;
  }

  if (
    !(await prisma.user.findUnique({ where: { email: decodedToken.email } }))
  ) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  return await refreshSessionToken(event, decodedToken);
});
