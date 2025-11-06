@echo off
echo Test de connectivite au backend...
curl -X GET http://localhost:3000/health
if %errorlevel% neq 0 (
    echo Backend non accessible. Demarrez le backend avec start-backend.bat
) else (
    echo Backend accessible!
)
pause
