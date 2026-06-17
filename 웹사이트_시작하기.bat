@echo off
start cmd /c "timeout /t 3 >nul && start http://localhost:3000"
npm run dev
