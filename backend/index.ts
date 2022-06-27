import { Mailer, setupNodeMailer } from "~/backend/setup/nodemailer";
import { PrismaClient } from "@prisma/client";
import { Transporter } from "nodemailer";

type ServerInstance = {
  prisma: PrismaClient;
  mailer: Mailer;
};

export enum TokenType {
  REGISTRATION = "registration",
  LOGIN = "login",
  SESSION = "session",
  REFRESH = "refresh",
}

export enum Roles {
  ORGANIZER = "organizer",
  SPEAKER = "speaker",
  PARTICIPANT = "participant",
}

let server: ServerInstance | null = null;

export const setupServer = async (): Promise<ServerInstance> => {
  const prisma = new PrismaClient();
  const mailer = await setupNodeMailer();

  return { mailer, prisma };
};

export const useServer = async (): Promise<ServerInstance> => {
  if (!server) {
    server = await setupServer();
  }

  return server;
};

export default setupServer;
