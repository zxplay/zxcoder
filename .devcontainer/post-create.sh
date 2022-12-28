#!/usr/bin/env bash

# Create .env files from example .env-dist files
cp .env-dist .env
cp apps/proxy/.env-dist apps/proxy/.env

# Use LTS version of Node.js
. ${NVM_DIR}/nvm.sh && nvm install --lts

# Install npm packages
npm install

# Set env vars before starting containers
export HASURA_GRAPHQL_ADMIN_SECRET=hasurapassword

# Start up containers
docker compose up --build -d

# Wait for Hasura to start
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:4000/healthz)" != "200" ]]; do sleep 5; done'
