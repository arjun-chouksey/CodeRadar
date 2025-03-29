#!/bin/bash

# Remove tailwind and related packages
npm uninstall tailwindcss postcss autoprefixer

# Install the specific versions we need
npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14

# Initialize tailwind (creates a new tailwind.config.js if needed)
npx tailwindcss init -p

# Start the development server
npm run dev 