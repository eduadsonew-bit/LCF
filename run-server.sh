#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=4096"
while true; do
    echo "Starting server at $(date)" >> server-start.log
    bun x next dev -p 3000 -H 0.0.0.0
    echo "Server stopped at $(date), restarting..." >> server-start.log
    sleep 2
done
