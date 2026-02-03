#!/bin/bash

echo "🔧 Setting up BeerAqui Database..."

# Check if PostgreSQL is running
if ! docker ps | grep -q beeraqui-postgres; then
    echo "📦 Starting PostgreSQL with PostGIS..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🚀 Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Database setup complete!"
echo ""
echo "📊 To view database in Prisma Studio, run:"
echo "   npm run prisma:studio"
