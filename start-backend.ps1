# Script PowerShell pour démarrer le backend
Write-Host "🚀 Démarrage du backend LinkUp..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    exit 1
}

# Aller dans le dossier backend
Set-Location backend

# Vérifier si package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ package.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json non trouvé dans le dossier backend" -ForegroundColor Red
    exit 1
}

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Démarrer le serveur
Write-Host "🌐 Démarrage du serveur sur http://localhost:3000..." -ForegroundColor Cyan
npm run dev
