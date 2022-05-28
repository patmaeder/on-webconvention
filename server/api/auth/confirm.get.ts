// token wird per get überreicht
// wird lokal gesetzt

import { Roles, useServer } from "~/server";
import { CompatibilityEvent, sendError, sendRedirect } from "h3";
import jwt from "jsonwebtoken";
import { setSessionToken } from "~/server/auth";

/**
 * Confirm Registration, which is handled by clicking a link containing a jwt token with username and email
 */

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const query = useQuery(event);
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

  let decodedToken;

  try {
    decodedToken = jwt.verify(query.token, process.env.JWT_SECRET);
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

  console.log(
    `Token could be verified for registration attempt of user <${decodedToken.email}>`
  );

  if (await prisma.user.findUnique({ where: { email: decodedToken.email } })) {
    sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Request cannot be verified.",
      })
    );
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email: decodedToken.email,
      name: decodedToken.name,
      role: Roles.PARTICIPANT,
    },
  });

  console.log(
    `Registration for use <${decodedToken.email}> confirmed. Prisma user created.`
  );

  await setSessionToken(event, { email: decodedToken.email });

  sendRedirect(event, "/");
});
