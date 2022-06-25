#!/bin/sh

echo "*** Starting deployment ... ***"
docker compose up -d --build
echo "*** Deployment done. ***"