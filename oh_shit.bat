@echo off
title GitHub Deploy
color 0A

echo =====================================
echo      GitHub Deploy Script
echo =====================================
echo.

:: Remove old git
if exist .git (
    echo Removing old Git repository...
    rmdir /s /q .git
)

:: Remove build folder
if exist .next (
    echo Removing .next...
    rmdir /s /q .next
)

:: Create .gitignore
echo Creating .gitignore...

(
echo # Dependencies
echo node_modules/
echo
echo # Next.js
echo .next/
echo out/
echo
echo # Environment
echo .env
echo .env.local
echo .env.production
echo .env.development
echo !.env.example
echo
echo # Logs
echo *.log
echo npm-debug.log*
echo
echo # TypeScript
echo *.tsbuildinfo
echo
echo # Build
echo dist/
echo coverage/
echo
echo # IDE
echo .vscode/
echo .idea/
echo
echo # OS
echo .DS_Store
echo Thumbs.db
)> .gitignore

echo.
echo Initializing Git...

git init

git branch -M main

echo.
echo Adding files...

git add .

echo.
echo Creating commit...

git commit -m "Initial commit"

echo.
echo Connecting GitHub...

git remote add origin https://github.com/Arest7/synthoria.git

echo.
echo Pushing...

git push -u origin main --force

echo.
echo =====================================
echo DONE!
echo =====================================

pause