import { CompatibilityEvent, setCookie } from "h3";
import { TokenType, useServer } from "~/server/index";
import jwt from "jsonwebtoken";

export const setSessionToken = async (event: CompatibilityEvent, { email }) => {
  let { prisma } = await useServer();
  let refreshToken = jwt.sign(
    {
      type: TokenType.REFRESH,
      email: email,
    },
    process.env.JWT_SECRET
  );

  let accessToken = jwt.sign(
    {
      type: TokenType.SESSION,
      email: email,
      refreshToken: refreshToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2m",
    }
  );

  setCookie(event, "Authorization", accessToken, {
    httpOnly: true,
    secure: true,
  });

  console.log(
    `Cookie was set for user <${email}> with new accessToken: ${accessToken}`
  );

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      refreshToken: refreshToken,
    },
  });
};
