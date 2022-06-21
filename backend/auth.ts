import { CompatibilityEvent, sendError, setCookie } from "h3";
import { Roles, TokenType, useServer } from "~/backend/index";
import jwt from "jsonwebtoken";

export type RegistrationTokenPayload = {
  type: TokenType;
  email: string;
  name: string;
};

export type LoginTokenPayload = {
  type: TokenType.LOGIN;
  email: string;
};

export type SessionTokenPayload = {
  type: TokenType;
  email: string;
  role: Roles;
  refreshToken: string;
};

export const setSessionToken = async (event: CompatibilityEvent, { email }) => {
  let { prisma } = await useServer();
  let refreshToken = jwt.sign(
    {
      type: TokenType.REFRESH,
      email: email,
    },
    process.env.JWT_SECRET
  );

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  let payload: SessionTokenPayload = {
    type: TokenType.SESSION,
    email: email,
    role: (user?.role as Roles) || Roles.PARTICIPANT,
    refreshToken: refreshToken,
  };

  let accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2m",
  });

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

export type Session =
  | {
      authenticated: boolean;
      name: string;
      email: string;
      role: Roles;
      expiresIn: number;
    }
  | { authenticated: false };

export const parseSessionToken = async (cookie: string): Promise<Session> => {
  let decodedToken;

  try {
    if (!cookie) {
      throw new Error("No cookie provided");
    }

    decodedToken = jwt.verify(cookie, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
  } catch (error) {
    return {
      authenticated: false,
    };
  }

  return {
    authenticated: true,
    name: decodedToken.name,
    email: decodedToken.email,
    role: decodedToken.role,
    expiresIn: decodedToken.exp,
  };
};

export const refreshSessionToken = async (
  event: CompatibilityEvent,
  payload: SessionTokenPayload
) => {
  if (!payload) {
    throw new Error("No payload provided");
  }

  try {
    jwt.verify(payload.refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    console.log(
      "[Auth]",
      `RefreshToken could not be verified for user <${payload.email}>`
    );
    return {
      refreshed: false,
    };
  }

  await setSessionToken(event, { email: payload.email });

  return {
    refreshed: true,
  };
};
