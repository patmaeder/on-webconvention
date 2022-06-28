import { useServer } from "~/backend";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    const roomId = event.context.params.roomId;
    const timestamp = new Date().getTime();

    const { prisma } = await useServer();
    const events = await prisma.event.findMany({
        where: {
            roomId: parseInt(roomId),
        },
        orderBy: [
            {
              startDate: 'desc',
            },
        ],
    });

    return events.filter(elem => new Date(elem.endDate).getTime() < timestamp).slice(0, 1);
});