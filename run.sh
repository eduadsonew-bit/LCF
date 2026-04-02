#!/bin/bash
trap 'echo "Received signal at $(date)" >> /tmp/server.log' SIGTERM SIGINT SIGKILL
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=4096"
echo "Starting server at $(date)" >> /tmp/server.log
npx next dev -p 3000 -H 0.0.0.0 2>&1 | tee -a /tmp/server.log
echo "Server exited at $(date) with code $?" >> /tmp/server.log
