@echo off
echo Reinstalling Tailwind CSS and dependencies...

rem Remove tailwind and related packages
call npm uninstall tailwindcss postcss autoprefixer

rem Install the specific versions we need
call npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14

rem Initialize tailwind (creates a new tailwind.config.js if needed)
call npx tailwindcss init -p

echo Starting development server...
call npm run dev 