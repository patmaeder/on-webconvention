// token wird per get überreicht
// wird lokal gesetzt

import { TokenType, useServer } from "~/server";
import { CompatibilityEvent, sendError, setCookie } from "h3";
import jwt from "jsonwebtoken";
import { setSessionToken } from "~/server/auth";

/**
 * Verify token url issued to login
 */

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const query = useQuery(event);

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

  let decodedToken;

  try {
    decodedToken = jwt.verify(query.token, process.env.JWT_SECRET);
    console.log(`Token for user ${decodedToken.email} is valid`);
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

  await setSessionToken(event, { email: decodedToken.email });
});
