#!/bin/sh

npx prisma migrate dev
npm run ws & node .output/server/index.mjs