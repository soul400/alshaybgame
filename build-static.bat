@echo off
echo Building Alshayeb Games for static use...
call npm run build
echo Build completed! Check the 'dist' folder for the static files.
echo.
echo Instructions:
echo 1. Copy the contents of the 'dist' folder to your web server or local folder.
echo 2. Open index.html in your browser to use the application.
echo.
pause