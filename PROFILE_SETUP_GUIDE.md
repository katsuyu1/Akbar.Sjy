# 📸 Panduan Menambahkan Foto Profil

Kami telah menambahkan fitur profil foto ke portfolio Anda! Berikut adalah panduan untuk mengaturnya.

## ✅ Apa yang Sudah Ditambahkan

1. **Element Foto Profil** - Ditambahkan di bagian "About Me"
2. **Styling Elegan** - Design dengan animasi hover dan efek gradient
3. **Responsive Design** - Menyesuaikan ukuran di desktop dan mobile
4. **Placeholder Files** - File template siap pakai

## 📥 Cara Menggunakan Foto Profil Anda

### Opsi 1: Gunakan Foto Pribadi Anda (Recommended)

1. **Siapkan foto profil**:
   - Format: JPG, PNG, atau WebP
   - Ukuran optimal: 300x300px atau lebih besar
   - Pastikan foto berkualitas tinggi

2. **Simpan file**:
   - Beri nama file: `profile.jpg` (atau `.png`, `.webp`)
   - Simpan di folder yang sama dengan `Index.html`
   - Pastikan path lengkapnya: `d:\cvAkbar\profile.jpg`

3. **Refresh portfolio**:
   - Buka `Index.html` di browser
   - Foto Anda akan tampil otomatis di bagian "About Me"

### Opsi 2: Gunakan Placeholder Template

Kami menyediakan template placeholder yang dapat Anda gunakan:

1. **Method A - Download Placeholder**:
   - Buka file `profile.html` di browser
   - Klik tombol "Generate Placeholder"
   - File `profile.jpg` akan otomatis diunduh
   - Simpan di folder `d:\cvAkbar\`

2. **Method B - Gunakan SVG Template**:
   - File `profile.svg` sudah tersedia
   - Anda dapat menggunakannya langsung atau mengkonversinya ke JPG

## 🎨 Fitur Desain Foto Profil

- **Rounded Corners**: Sudut melengkung dengan radius 20px
- **Animated Border**: Border gradient yang bergerak halus
- **Hover Effect**: Foto terangkat saat di-hover dengan efek scale
- **Shadow Effect**: Bayangan elegan dengan warna accent
- **Responsive**: Ukuran menyesuaikan di device berbeda

## 📱 Ukuran Foto di Berbagai Device

- **Desktop**: 320x320px
- **Tablet**: 280x280px
- **Mobile**: 250x250px

## 🔧 Kustomisasi

### Jika ingin mengubah ukuran foto:

Edit di `style.css` baris ~835:
```css
.profile-photo-wrapper {
	width: 320px;  /* Ubah nilai ini */
	height: 320px; /* Ubah nilai ini */
}
```

### Jika ingin mengubah efek hover:

Edit di `style.css` baris ~854:
```css
.profile-photo:hover {
	transform: translateY(-10px) scale(1.02);
	box-shadow: 0 40px 80px rgba(138, 43, 226, 0.35);
}
```

## 🎯 Checklist Implementasi

- [x] Element foto profil ditambahkan ke HTML
- [x] CSS styling untuk foto profil dibuat
- [x] Responsive design untuk mobile diatur
- [x] Animasi hover ditambahkan
- [x] Border gradient animation dibuat
- [ ] Upload foto profil Anda ke folder
- [ ] Refresh browser untuk melihat hasilnya

## 📝 Nama File yang Didukung

Sistem akan mencari file dengan nama-nama ini (dalam urutan prioritas):
1. `profile.jpg`
2. `profile.png`
3. `profile.webp`
4. `profile.jpeg`

Gunakan salah satu dari opsi di atas.

## ⚠️ Troubleshooting

**Foto tidak muncul?**
- Pastikan nama file exactly `profile.jpg` (case-sensitive pada Linux)
- Verifikasi file ada di folder `d:\cvAkbar\`
- Clear browser cache (Ctrl+Shift+Delete) dan refresh
- Buka Dev Tools (F12) untuk check apakah ada error

**Foto terlihat blurry/pixelated?**
- Gunakan foto dengan resolusi tinggi (minimal 300x300px)
- Format JPG dengan quality 90%+ adalah optimal

**Ingin mengganti foto?**
- Timpa file `profile.jpg` dengan foto baru yang sama
- Refresh halaman, foto akan diperbarui

## 🚀 Tips Mengambil Foto Profil Terbaik

1. **Pencahayaan**: Gunakan pencahayaan natural dari depan
2. **Background**: Pilih background solid atau blurred sederhana
3. **Ekspresi**: Tersenyum natural, mata fokus ke kamera
4. **Framing**: Foto close-up dari bahu ke atas
5. **Editing**: Gunakan app seperti Canva atau Photoshop untuk edit minor

---

Selamat mengatur foto profil Anda! Jika ada pertanyaan, silakan tanyakan. 😊
