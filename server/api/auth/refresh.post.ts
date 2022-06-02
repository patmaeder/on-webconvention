import { useServer } from "~/backend";
import { CompatibilityEvent, sendError, useCookie } from "h3";
import jwt from "jsonwebtoken";
import { refreshSessionToken } from "~/backend/auth";

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const sessionToken = useCookie(event, "Authorization");

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
      "[Auth]",
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

  let existingUser = await prisma.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (!existingUser) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  if (existingUser.refreshToken !== decodedToken.refreshToken) {
    console.log(
      "[Auth]",
      `Cannot renew session for user <${decodedToken.email}> because refreshToken is not valid anymore.`
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

  return await refreshSessionToken(event, decodedToken);
});
