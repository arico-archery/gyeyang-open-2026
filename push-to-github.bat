@echo off
chcp 65001 >nul
echo ========================================
echo  2026 GYEYANG OPEN - GitHub Push Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Initializing git...
git init -b main

echo.
echo [2/5] Adding all files...
git add .

echo.
echo [3/5] Creating commit...
git commit -m "feat: 2026 Gyeyang Open website - initial commit"

echo.
echo [4/5] Adding remote...
git remote add origin https://github.com/arico-archery/gyeyang-open-2026.git

echo.
echo [5/5] Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  Done! Check https://github.com/arico-archery/gyeyang-open-2026
echo ========================================
pause
