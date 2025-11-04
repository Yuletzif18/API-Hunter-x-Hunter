# Script de diagnóstico para Railway
Write-Host "=== Diagnóstico de Railway Deployment ===" -ForegroundColor Cyan
Write-Host ""

# 1. Test Health Endpoint
Write-Host "1. Probando endpoint /health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://mysql-backend-proyecto.up.railway.app/health" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Health check OK" -ForegroundColor Green
    Write-Host "   Response: $($health | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Health check FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response Body: $responseBody" -ForegroundColor Gray
    }
}

Write-Host ""

# 2. Test API Personajes
Write-Host "2. Probando endpoint /api/personajes..." -ForegroundColor Yellow
try {
    $personajes = Invoke-RestMethod -Uri "https://mysql-backend-proyecto.up.railway.app/api/personajes" -Method Get -ErrorAction Stop
    Write-Host "   ✓ API personajes OK" -ForegroundColor Green
    Write-Host "   Personajes encontrados: $($personajes.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ API personajes FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Test Docs
Write-Host "3. Probando endpoint /docs..." -ForegroundColor Yellow
try {
    $docs = Invoke-WebRequest -Uri "https://mysql-backend-proyecto.up.railway.app/docs" -Method Get -ErrorAction Stop
    Write-Host "   ✓ Docs OK (Status: $($docs.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Docs FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Diagnóstico completado ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "Si todos los endpoints fallan con error 502:"
Write-Host "1. Ve a Railway Dashboard: https://railway.app/dashboard"
Write-Host "2. Abre tu proyecto y el servicio 'mysql-backend-proyecto'"
Write-Host "3. Ve a Deployments > Click en el último deployment > View Logs"
Write-Host "4. Copia los logs y pégalos aquí para diagnosticar el problema"
Write-Host ""
