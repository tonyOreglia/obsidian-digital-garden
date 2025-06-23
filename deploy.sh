#!/bin/sh

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "Error: .env file not found"
  exit 1
fi

# Check if required environment variables are set
if [ -z "$SERVER" ] || [ -z "$DIR" ]; then
  echo "Error: SERVER and DIR must be defined in .env file"
  exit 1
fi

rsync -avz --delete public/ ${SERVER}:${DIR}

exit 0
