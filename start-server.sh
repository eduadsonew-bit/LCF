#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=1024"
while true; do
    echo "Starting Next.js server..." >> dev.log
    bun x next dev -p 3000 >> dev.log 2>&1
    echo "Server stopped, restarting in 3 seconds..." >> dev.log
    sleep 3
done
