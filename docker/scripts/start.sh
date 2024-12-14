#!/bin/sh
set -e

# Wait for external MySQL database
echo "Checking database connection..."
node docker/scripts/check-db.js

# Start the application
echo "Starting application..."
npm start