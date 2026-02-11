#!/usr/bin/env python3
"""
Profile Photo Generator
Menghasilkan foto profil placeholder dengan inisial Anda
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_profile(name="Akbar Sanjaya", output_path="profile.jpg", size=320):
    """
    Generate placeholder profile photo dengan inisial
    
    Args:
        name: Nama untuk inisial (gunakan nama pertama dan belakang)
        output_path: Path untuk menyimpan gambar
        size: Ukuran gambar (default 320x320)
    """
    
    # Create image dengan gradient background
    img = Image.new('RGB', (size, size), color=(102, 126, 234))
    
    # Buat gradient manually
    pixels = img.load()
    for x in range(size):
        for y in range(size):
            # Interpolasi dari blue ke purple
            r = int(102 + (118 - 102) * (x + y) / (size * 2))
            g = int(126 + (75 - 126) * (x + y) / (size * 2))
            b = int(234 - (42 - 234) * (x + y) / (size * 2))
            pixels[x, y] = (r, g, b)
    
    # Draw circle background
    draw = ImageDraw.Draw(img, 'RGBA')
    circle_radius = int(size * 0.35)
    circle_center = size // 2
    draw.ellipse(
        [(circle_center - circle_radius, circle_center - circle_radius),
         (circle_center + circle_radius, circle_center + circle_radius)],
        fill=(255, 255, 255, 40)
    )
    
    # Get initials dari nama
    parts = name.split()
    initials = "".join([p[0].upper() for p in parts[:2]])  # Max 2 inisial
    
    # Draw text dengan font
    try:
        # Coba gunakan font system, fallback ke default
        font = ImageFont.truetype("arial.ttf", int(size * 0.35))
    except:
        font = ImageFont.load_default()
    
    # Get text bounding box untuk center
    bbox = draw.textbbox((0, 0), initials, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2
    
    # Draw initials
    draw.text((text_x, text_y), initials, fill=(255, 255, 255), font=font)
    
    # Decorative circles
    draw.ellipse([(40, 40), (56, 56)], fill=(255, 255, 255, 75))
    draw.ellipse([(size-56, size-56), (size-40, size-40)], fill=(255, 255, 255, 50))
    
    # Save image
    img.save(output_path, 'JPEG', quality=95)
    print(f"✅ Foto profil berhasil dibuat: {output_path}")
    print(f"   Ukuran: {size}x{size}px")
    print(f"   Inisial: {initials}")
    print(f"\n📌 Simpan file ini di folder yang sama dengan Index.html")
    print(f"   Path: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    print("="*50)
    print("   Profile Photo Generator")
    print("="*50)
    
    # Check apakah PIL terinstall
    try:
        from PIL import Image, ImageDraw, ImageFont
        print("✅ PIL (Pillow) terdeteksi")
    except ImportError:
        print("❌ PIL (Pillow) tidak terinstall")
        print("   Install dengan: pip install Pillow")
        exit(1)
    
    # Get input dari user
    name = input("\nMasukkan nama Anda (default: Akbar Sanjaya): ").strip()
    if not name:
        name = "Akbar Sanjaya"
    
    size = input("Masukkan ukuran foto (default: 320): ").strip()
    try:
        size = int(size) if size else 320
    except:
        size = 320
    
    # Create output path
    output_file = "profile.jpg"
    
    # Generate placeholder
    print(f"\n⏳ Membuat foto profil...")
    create_placeholder_profile(name, output_file, size)
    
    print("\n🎉 Selesai!")
    print(f"   Buka Index.html untuk melihat foto Anda di portfolio")
