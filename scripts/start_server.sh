#!/bin/bash
cd /var/nodeapp/
mkdir -p /var/log/nodeapp-logs
forever start index.js -o /var/log/nodeapp-logs/output.log -e /var/log/nodeapp-logs/output.log