import { setupNodeMailer } from "~/server/setup/nodemailer";
import { PrismaClient } from "@prisma/client";
import { Transporter } from "nodemailer";

type ServerInstance = {
  prisma: PrismaClient;
  mailer: Transporter;
};

export enum TokenType {
  REGISTRATION = "registration",
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
  const mailer = setupNodeMailer();

  return { mailer, prisma };
};

export const useServer = async (): Promise<ServerInstance> => {
  if (!server) {
    server = await setupServer();
  }

  return server;
};

export default setupServer;
