#!/bin/bash
set -e

echo "Waiting for PostgreSQL database to be ready..."
until pg_isready -h db -U admin -d artistic_education; do
  echo "Database is unavailable - sleeping..."
  sleep 2
done

echo "PostgreSQL is up and running!"

# Push schema directly to DB (no migration files needed)
echo "Applying Prisma schema to database..."
./node_modules/.bin/prisma db push --accept-data-loss

# Seed the database (skip gracefully if data already exists)
echo "Seeding the database (if needed)..."
./node_modules/.bin/prisma db seed 2>/dev/null || echo "Seed skipped (data may already exist)"

# Start the Next.js standalone server
echo "Starting Next.js production server on port 3000..."
exec node /app/server.js