#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=4096"
while true; do
  echo "Starting Next.js at $(date)" >> /tmp/nextjs.log
  npx next dev -p 3000 -H 0.0.0.0 2>&1 | tee -a /tmp/nextjs.log
  echo "Next.js exited at $(date), restarting in 2 seconds..." >> /tmp/nextjs.log
  sleep 2
done
