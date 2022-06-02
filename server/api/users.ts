import { useServer } from "~/backend";
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const { prisma } = await useServer();

  return await prisma.user.findMany({
    select: {
      email: true,
    },
  });
});
