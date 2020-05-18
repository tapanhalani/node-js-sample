#!/bin/bash
cd /var/nodeapp/
mkdir -p /var/log/nodeapp-logs
forever start index.js -l /var/log/nodeapp-logs/output.log