import { createError, deleteCookie, sendError, useCookie } from "h3";
import jwt from "jsonwebtoken";
import { useServer } from "~/server";

export default defineEventHandler(async (event) => {
  const sessionToken = useCookie(event, "Authorization");

  const { prisma } = await useServer();

  if (!sessionToken) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Logout requires a token.",
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

  await prisma.user.update({
    where: { email: decodedToken.email },
    data: { refreshToken: null },
  });
  deleteCookie(event, "Authorization");

  console.log(`User <${decodedToken.email}> was logged out successfully.`);

  return {
    success: true,
  };
});
