@echo off
REM Script para editar el soundtrack del Bosque Sagrado
REM Elimina los primeros 11 segundos de delay

echo === Editando Soundtrack del Bosque Sagrado ===
echo.

REM Verificar si ffmpeg está instalado
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ffmpeg no está instalado
    echo Por favor, instala ffmpeg desde: https://ffmpeg.org/download.html
    echo.
    pause
    exit /b 1
)

echo ✓ ffmpeg encontrado
echo.

REM Ruta del archivo original
set "ORIGINAL=soundtrack-bosquesagrado.mp3"
set "OUTPUT=soundtrack-bosquesagrado-web.mp3"

REM Verificar que el archivo existe
if not exist "%ORIGINAL%" (
    echo ERROR: El archivo %ORIGINAL% no existe
    echo Por favor, verifica la ruta del archivo
    echo.
    pause
    exit /b 1
)

echo ✓ Archivo original encontrado: %ORIGINAL%
echo.

REM Crear backup del archivo original
echo Creando backup...
copy "%ORIGINAL%" "%ORIGINAL%.backup" >nul
echo ✓ Backup creado: %ORIGINAL%.backup
echo.

REM Editar el audio - eliminar primeros 11 segundos
echo Editando audio (eliminando 11 segundos de delay)...
ffmpeg -i "%ORIGINAL%" -ss 00:00:11 -acodec copy "%OUTPUT%" -y >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✓ Audio editado exitosamente
    echo.
    echo Archivo de salida: %OUTPUT%
    echo.

    REM Preguntar si quiere reemplazar el original
    set /p REPLACE="¿Quieres reemplazar el archivo original? (s/N): "
    if /i "%REPLACE%"=="s" (
        echo Reemplazando archivo original...
        move "%OUTPUT%" "%ORIGINAL%" >nul
        echo ✓ Archivo original reemplazado
        echo.
        echo El backup está disponible en: %ORIGINAL%.backup
    ) else (
        echo.
        echo El archivo editado se guarda como: %OUTPUT%
        echo El original permanece sin cambios
    )
) else (
    echo ✗ Error al editar el audio
    echo.
    echo El backup está disponible en: %ORIGINAL%.backup
)

echo.
echo === Proceso completado ===
echo.
pause