# Script PowerShell para editar el soundtrack del Bosque Sagrado
# Elimina los primeros 11 segundos de delay del audio

Write-Host "=== Editando Soundtrack del Bosque Sagrado ===" -ForegroundColor Cyan
Write-Host ""

# Configuración
$originalFile = "soundtrack-bosquesagrado.mp3"
$outputFile = "soundtrack-bosquesagrado-web.mp3"
$backupFile = "soundtrack-bosquesagrado.mp3.backup"
$delaySeconds = 11

# Cambiar al directorio correcto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Directorio actual: $PWD" -ForegroundColor Yellow
Write-Host ""

# Verificar si ffmpeg está instalado
Write-Host "Verificando ffmpeg..." -ForegroundColor Yellow
$ffmpegInstalled = Get-Command ffmpeg -ErrorAction SilentlyContinue

if (-not $ffmpegInstalled) {
    Write-Host "✗ ffmpeg no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instala ffmpeg desde:" -ForegroundColor White
    Write-Host "https://ffmpeg.org/download.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O usa Chocolatey:" -ForegroundColor White
    Write-Host "choco install ffmpeg" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✓ ffmpeg encontrado" -ForegroundColor Green
Write-Host "Versión:" -ForegroundColor Yellow
ffmpeg -version | Select-Object -First 1
Write-Host ""

# Verificar que el archivo original existe
Write-Host "Verificando archivo original..." -ForegroundColor Yellow
if (-not (Test-Path $originalFile)) {
    Write-Host "✗ El archivo $originalFile no existe" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, verifica que el archivo esté en el directorio correcto" -ForegroundColor White
    Write-Host "Directorio esperado: oasysbasecamp" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✓ Archivo original encontrado: $originalFile" -ForegroundColor Green
Write-Host ""

# Crear backup del archivo original
Write-Host "Creando backup..." -ForegroundColor Yellow
try {
    Copy-Item $originalFile $backupFile -Force
    Write-Host "✓ Backup creado: $backupFile" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Error al crear backup" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Editar el audio - eliminar primeros 11 segundos
Write-Host "Editando audio..." -ForegroundColor Yellow
Write-Host "Eliminando $delaySeconds segundos de delay" -ForegroundColor White
Write-Host ""

try {
    $timeStamp = "00:00:$($delaySeconds.ToString('00'))"
    $ffmpegArgs = @(
        "-i", $originalFile
        "-ss", $timeStamp
        "-acodec", "copy"
        $outputFile
        "-y"
    )

    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Host "✓ Audio editado exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "Archivo de salida: $outputFile" -ForegroundColor Cyan
        Write-Host ""

        # Mostrar información del archivo editado
        Write-Host "Información del archivo editado:" -ForegroundColor Yellow
        ffmpeg -i $outputFile 2>&1 | Select-String "Duration" | Select-Object -First 1
        Write-Host ""

        # Preguntar si quiere reemplazar el original
        $replace = Read-Host "¿Quieres reemplazar el archivo original? (s/N)"

        if ($replace -eq "s" -or $replace -eq "S") {
            Write-Host ""
            Write-Host "Reemplazando archivo original..." -ForegroundColor Yellow
            try {
                Copy-Item $outputFile $originalFile -Force
                Remove-Item $outputFile -Force
                Write-Host "✓ Archivo original reemplazado" -ForegroundColor Green
                Write-Host ""
                Write-Host "El backup está disponible en: $backupFile" -ForegroundColor Cyan
            } catch {
                Write-Host "✗ Error al reemplazar archivo" -ForegroundColor Red
                Write-Host $_.Exception.Message
            }
        } else {
            Write-Host ""
            Write-Host "El archivo editado se guarda como: $outputFile" -ForegroundColor Cyan
            Write-Host "El original permanece sin cambios" -ForegroundColor White
            Write-Host ""
            Write-Host "Para usar el archivo editado, renómbralo o reemplaza el original manualmente" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Error al editar el audio" -ForegroundColor Red
        Write-Host "Código de salida: $($process.ExitCode)" -ForegroundColor White
        Write-Host ""
        Write-Host "El backup está disponible en: $backupFile" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ Error durante el proceso de edición" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "El backup está disponible en: $backupFile" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Proceso completado ===" -ForegroundColor Green
Write-Host ""
Read-Host "Presiona Enter para salir"