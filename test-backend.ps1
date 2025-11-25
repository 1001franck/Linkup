# Script PowerShell pour tester la connectivité au backend
Write-Host "🔍 Test de connectivité au backend LinkUp..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend accessible!" -ForegroundColor Green
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Cyan
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Backend répond mais avec un code d'erreur: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend non accessible!" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions possibles:" -ForegroundColor Yellow
    Write-Host "1. Démarrer le backend avec: start-backend.bat" -ForegroundColor White
    Write-Host "2. Vérifier que le port 3000 est libre" -ForegroundColor White
    Write-Host "3. Vérifier les variables d'environnement" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
