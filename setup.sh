#!/bin/bash

echo "============================================"
echo "Church Care App - Quick Start Script"
echo "============================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✓ PostgreSQL found"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js found ($(node --version))"

# Database setup
echo ""
echo "Setting up database..."
echo "Please enter your PostgreSQL password when prompted."
echo ""

# Create database if it doesn't exist
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'church_care'" | grep -q 1 || \
psql -U postgres -c "CREATE DATABASE church_care"

if [ $? -eq 0 ]; then
    echo "✓ Database 'church_care' ready"
else
    echo "⚠ Could not verify database. Please create it manually:"
    echo "  psql -U postgres -c 'CREATE DATABASE church_care'"
fi

# Run schema
echo ""
echo "Running database schema..."
psql -U postgres -d church_care -f backend/database/schema.sql > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Database schema created"
else
    echo "⚠ Schema may already exist or there was an error"
fi

# Backend setup
echo ""
echo "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created backend .env file from example"
    echo "⚠ Please edit backend/.env and update the configuration"
else
    echo "✓ Backend .env file already exists"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install > /dev/null 2>&1
    echo "✓ Backend dependencies installed"
else
    echo "✓ Backend dependencies already installed"
fi

cd ..

# Frontend setup
echo ""
echo "Setting up frontend..."
cd frontend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created frontend .env file from example"
else
    echo "✓ Frontend .env file already exists"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "============================================"
echo "✓ Setup Complete!"
echo "============================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Note: Make sure to configure backend/.env with:"
echo "  - Your PostgreSQL credentials"
echo "  - A secure JWT_SECRET"
echo "  - Your OpenAI API key (optional, for AI insights)"
echo ""
