#!/bin/sh

# Validate environment variables
node ./scripts/env.js

# If validation passes, start the application
exec node server.js