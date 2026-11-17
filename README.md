# Escape from the Maze — Answer vs Hacker

Game edukasi untuk siswa kelas 7 berbasis HTML, Tailwind CSS, CSS, dan Vanilla JavaScript.

## Menjalankan
1. Ekstrak folder project.
2. Buka `index.html` di browser modern.
3. Isi nama dan kelas, lalu mulai bermain.

Tailwind CSS dan Google Fonts dimuat melalui CDN, sehingga koneksi internet diperlukan untuk styling/font tersebut. Fitur game dan penyimpanan hasil berjalan lokal melalui LocalStorage.

## Catatan
- Efek suara dibuat secara sintetis dengan Web Audio API; tidak memerlukan file MP3.
- Hasil disimpan pada browser/perangkat yang sama.
- Leaderboard lintas perangkat membutuhkan backend/database dan belum termasuk versi ini.
- Maze berupa grid 9x9 dengan dinding, jalur, penjaga hacker, dan titik finish.
