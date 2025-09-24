# 🌐 Asdes - Pengajuan Laporan Infrastruktur Desa

Aplikasi web untuk pengajuan laporan infrastruktur desa berbasis **Next.js**.  
Fitur utama:
- 🔐 Autentikasi menggunakan **Firebase Auth**
- 🗺️ Peta interaktif dengan **Leaflet.js**
- 📸 Upload foto laporan ke server via **PHP file upload**
- 📊 Dashboard laporan masyarakat

---

## 🚀 Tech Stack

- [Next.js 14+](https://nextjs.org/) - Frontend React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Firebase Auth](https://firebase.google.com/docs/auth) - Authentication
- [Leaflet.js](https://leafletjs.com/) - Peta interaktif
- PHP + File Manager Hosting - Penyimpanan foto laporan

---

## 📦 Installation

### 1. Clone Repository
https://github.com/chandafa/ASDES-Aspirasi-Desa
cd asdes
2. Install Dependencies :
npm install
# atau
yarn install
⚙️ Configuration
1. Firebase Config
Buat project di Firebase Console → Aktifkan Authentication (Email/Password).

Lalu buat file .env.local di root project :
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Custom API (PHP Upload Handler)
NEXT_PUBLIC_UPLOAD_URL=https://yourdomain.com/upload.php
⚠️ Jangan commit file .env.local ke GitHub (sudah otomatis di-ignore oleh Next.js).

▶️ Running the App
Development Mode :
npm run dev
Akses di http://localhost:9002

Production Build :
npm run build
npm run start