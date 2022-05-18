import { PrismaClient } from "@prisma/client";
type ServerInstance = {
  prisma: PrismaClient;
};
let server: ServerInstance | null = null;

export const setupServer = async (): Promise<ServerInstance> => {
  const prisma = new PrismaClient();
  return { prisma };
};

export const useServer = async (): Promise<ServerInstance> => {
  if (!server) {
    server = await setupServer();
  }

  return server;
};

export default setupServer;
