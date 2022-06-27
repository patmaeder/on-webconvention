import { TokenType, useServer } from "~/backend";
import { CompatibilityEvent, createError, sendError, sendRedirect } from "h3";
import jwt from "jsonwebtoken";
import { LoginTokenPayload, setSessionToken } from "~/backend/auth";

/**
 * Verifies a login token handled via GET-request. No further checks for authorization are needed when the token can be verified.
 */

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const query: any = useQuery(event);
  const { prisma } = await useServer();

  if (!query.token) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Verification process requires a token.",
      })
    );
    return;
  }

  let decodedToken: LoginTokenPayload;

  try {
    decodedToken = jwt.verify(query.token, process.env.JWT_SECRET);
    console.log(
      "[Auth]",
      `LoginToken for user ${decodedToken.email} is valid.`
    );
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

  if (decodedToken.type !== TokenType.LOGIN) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  let user = await prisma.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (user.refreshToken) {
    console.log(
      "[Auth]",
      `Login request for user <${decodedToken.email}> can be verified but user has remaining refresh-token. Token will be overwritten.`
    );
  }

  await setSessionToken(event, { email: decodedToken.email });

  await sendRedirect(event, "/");
});
