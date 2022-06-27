import { useServer } from "~/backend";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    const roomId = event.context.params.roomId;

    const { prisma } = await useServer();
    return await prisma.eventRoom.findFirst({
        where: {
            id: parseInt(roomId),
        },
    });
});