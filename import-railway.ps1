# Script para importar bases de datos a Railway MySQL
Write-Host "=== Importando bases de datos a Railway MySQL ===" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos SQL
$personajesSQL = "BD\personajes_hunterxhunter.sql"
$habilidadesSQL = "BD\habilidades_hunterxhunter.sql"

if (-not (Test-Path $personajesSQL)) {
    Write-Host "ERROR: No se encuentra $personajesSQL" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $habilidadesSQL)) {
    Write-Host "ERROR: No se encuentra $habilidadesSQL" -ForegroundColor Red
    exit 1
}

Write-Host "Archivos SQL encontrados OK" -ForegroundColor Green
Write-Host ""

# Solicitar credenciales de Railway
Write-Host "Ingresa las credenciales de Railway MySQL:" -ForegroundColor Cyan
Write-Host "(Obtenerlas de Railway Dashboard > MySQL Service > Variables)" -ForegroundColor Gray
Write-Host ""

$host_railway = Read-Host "MYSQL_HOST"
$port_railway = Read-Host "MYSQL_PORT"
$user_railway = Read-Host "MYSQL_USER"
$pass_railway = Read-Host "MYSQL_PASSWORD"
$db_railway = Read-Host "MYSQL_DATABASE"

Write-Host ""

# Verificar si mysql CLI esta disponible
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue

if (-not $mysqlPath) {
    Write-Host "MySQL CLI no encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "SOLUCION: Importar con MySQL Workbench o phpMyAdmin" -ForegroundColor Cyan
    Write-Host "1. Descarga MySQL Workbench: https://dev.mysql.com/downloads/workbench/" -ForegroundColor White
    Write-Host "2. Conecta con estas credenciales:" -ForegroundColor White
    Write-Host "   Host: $host_railway" -ForegroundColor Gray
    Write-Host "   Port: $port_railway" -ForegroundColor Gray
    Write-Host "   User: $user_railway" -ForegroundColor Gray
    Write-Host "   Password: $pass_railway" -ForegroundColor Gray
    Write-Host "   Database: $db_railway" -ForegroundColor Gray
    Write-Host "3. Importa los archivos:" -ForegroundColor White
    Write-Host "   - $personajesSQL" -ForegroundColor Gray
    Write-Host "   - $habilidadesSQL" -ForegroundColor Gray
    Write-Host ""
    
    # Guardar credenciales
    $mysqlUrl = "mysql://${user_railway}:${pass_railway}@${host_railway}:${port_railway}/${db_railway}"
    $credsContent = @"
Railway MySQL Credentials
========================
Host: $host_railway
Port: $port_railway
User: $user_railway
Password: $pass_railway
Database: $db_railway

Connection URL:
$mysqlUrl

Variables para Railway Dashboard:
MYSQL_URI_PERSONAJES=$mysqlUrl
MYSQL_URI_HABILIDADES=$mysqlUrl
"@
    
    $credsContent | Out-File "railway-credentials.txt" -Encoding UTF8
    Write-Host "Credenciales guardadas en: railway-credentials.txt" -ForegroundColor Green
    exit 0
}

# Importar con mysql CLI
Write-Host "Importando tablas a Railway..." -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "1. Importando personajes..." -ForegroundColor Cyan
    & mysql -h $host_railway -P $port_railway -u $user_railway "-p$pass_railway" $db_railway -e "SOURCE $personajesSQL"
    Write-Host "   OK" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

try {
    Write-Host "2. Importando habilidades..." -ForegroundColor Cyan
    & mysql -h $host_railway -P $port_railway -u $user_railway "-p$pass_railway" $db_railway -e "SOURCE $habilidadesSQL"
    Write-Host "   OK" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Importacion completada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Actualiza estas variables en Railway Dashboard:" -ForegroundColor Yellow
$mysqlUrl = "mysql://${user_railway}:${pass_railway}@${host_railway}:${port_railway}/${db_railway}"
Write-Host "MYSQL_URI_PERSONAJES=$mysqlUrl" -ForegroundColor Gray
Write-Host "MYSQL_URI_HABILIDADES=$mysqlUrl" -ForegroundColor Gray
