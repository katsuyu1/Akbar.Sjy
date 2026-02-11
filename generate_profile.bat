@echo off
REM ============================================
REM Profile Photo Generator for Portfolio
REM ============================================

echo.
echo ==========================================
echo    Profile Photo Generator
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python tidak terinstall!
    echo.
    echo Silakan install Python terlebih dahulu dari:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] Python terdeteksi
echo.

REM Check if Pillow is installed
python -c "from PIL import Image" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Pillow library tidak terinstall
    echo [INFO] Installing Pillow...
    echo.
    pip install Pillow -q
    echo [OK] Pillow berhasil diinstall
    echo.
)

REM Run the generator
echo [INFO] Menjalankan Profile Photo Generator...
echo.
python generate_profile.py

if errorlevel 1 (
    echo.
    echo ERROR: Ada masalah saat generate foto
    pause
    exit /b 1
)

echo.
echo ==========================================
echo [OK] Selesai!
echo ==========================================
echo.
echo Langkah selanjutnya:
echo 1. Buka Index.html di browser
echo 2. Scroll ke bagian "About Me"
echo 3. Lihat foto profil Anda ditampilkan
echo.
pause
