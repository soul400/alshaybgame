@echo off
echo Starting Alshayeb Games Application...
echo.

REM تحديد المتغيرات البيئية اللازمة
set NODE_ENV=development
set PORT=3000

REM تأكد من وجود npx
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npx غير موجود. يرجى تثبيت Node.js أولاً.
    echo يمكنك تحميل Node.js من https://nodejs.org/
    pause
    exit /b 1
)

REM تحقق من تثبيت الاعتماديات
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: فشل تثبيت الحزم، يرجى المحاولة مرة أخرى.
        pause
        exit /b 1
    )
)

echo.
echo Starting server at http://localhost:%PORT%
echo Press Ctrl+C to stop the server
echo.

REM تشغيل السيرفر
npx tsx server/index.ts

pause