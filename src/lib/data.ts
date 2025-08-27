import type { User, Report, BlogPost, Comment } from './types';

export const users: User[] = [
  {
    uid: 'admin01',
    name: 'Admin Desa',
    email: 'admin@desa.connect',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin01',
    preferences: { theme: 'light' },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    uid: 'warga01',
    name: 'Budi Santoso',
    email: 'budi.s@example.com',
    role: 'warga',
    avatarUrl: 'https://i.pravatar.cc/150?u=warga01',
    preferences: { theme: 'dark' },
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-01-15T09:00:00Z',
  },
];

export const reports: Report[] = [
  {
    id: 'report001',
    title: 'Jalan berlubang di depan balai desa',
    description: 'Jalan utama desa di depan balai desa memiliki banyak lubang yang berbahaya bagi pengendara motor, terutama di malam hari. Mohon segera diperbaiki.',
    category: 'Jalan Rusak',
    photos: ['https://picsum.photos/seed/report001/400/300'],
    createdBy: 'warga01',
    createdAt: '2023-10-01T10:00:00Z',
    location: { lat: -6.200000, lng: 106.816666, address: 'Jl. Raya Desa, Depan Balai Desa' },
    status: 'resolved',
    timeline: [
        { actorUid: 'warga01', action: 'Laporan dibuat', message: '', timestamp: '2023-10-01T10:00:00Z'},
        { actorUid: 'admin01', action: 'Status diubah ke "in_progress"', message: 'Tim sedang meninjau', timestamp: '2023-10-02T11:00:00Z'},
        { actorUid: 'admin01', action: 'Status diubah ke "resolved"', message: 'Perbaikan telah selesai', timestamp: '2023-10-05T15:00:00Z'},
    ],
  },
  {
    id: 'report002',
    title: 'Lampu jalan mati dekat jembatan',
    description: 'Satu-satunya lampu jalan di dekat jembatan utama sudah mati selama seminggu. Area tersebut menjadi sangat gelap dan rawan kecelakaan.',
    category: 'Lampu Jalan',
    photos: ['https://picsum.photos/seed/report002/400/300'],
    createdBy: 'warga01',
    createdAt: '2023-10-03T19:30:00Z',
    location: { lat: -6.201500, lng: 106.820000, address: 'Dekat Jembatan Utama' },
    status: 'in_progress',
    timeline: [
        { actorUid: 'warga01', action: 'Laporan dibuat', message: '', timestamp: '2023-10-03T19:30:00Z'},
        { actorUid: 'admin01', action: 'Status diubah ke "in_progress"', message: 'Penggantian bohlam dijadwalkan', timestamp: '2023-10-04T09:00:00Z'},
    ],
  },
  {
    id: 'report003',
    title: 'Got mampet menyebabkan banjir',
    description: 'Drainase di RT 03/RW 01 tersumbat sampah, menyebabkan genangan air setiap kali hujan. Baunya juga tidak sedap.',
    category: 'Drainase Mampet',
    photos: ['https://picsum.photos/seed/report003/400/300'],
    createdBy: 'warga01',
    createdAt: '2023-10-05T08:00:00Z',
    location: { lat: -6.199800, lng: 106.815000, address: 'RT 03/RW 01' },
    status: 'pending',
    timeline: [
        { actorUid: 'warga01', action: 'Laporan dibuat', message: '', timestamp: '2023-10-05T08:00:00Z'},
    ],
  },
  {
    id: 'report004',
    title: 'Pagar jembatan bambu keropos',
    description: 'Pagar pengaman di jembatan bambu yang melintasi sungai kecil sudah mulai keropos dan goyang. Bahaya untuk anak-anak yang sering bermain di sana.',
    category: 'Jembatan Patah',
    photos: ['https://picsum.photos/seed/report004/400/300'],
    createdBy: 'warga01',
    createdAt: '2023-10-06T14:00:00Z',
    location: { lat: -6.202500, lng: 106.818000, address: 'Jembatan Bambu, Sungai Kecil' },
    status: 'rejected',
    timeline: [
        { actorUid: 'warga01', action: 'Laporan dibuat', message: '', timestamp: '2023-10-06T14:00:00Z'},
        { actorUid: 'admin01', action: 'Status diubah ke "rejected"', message: 'Perbaikan jembatan sudah masuk dalam rencana pembangunan tahunan.', timestamp: '2023-10-07T10:00:00Z'},
    ],
  },
];

export const recentReports = reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const blogPosts: BlogPost[] = [
  {
    id: 'post01',
    title: 'Gotong Royong Membersihkan Saluran Air Desa',
    slug: 'gotong-royong-membersihkan-saluran-air',
    body: 'Pada hari Minggu kemarin, warga desa berpartisipasi dalam kegiatan kerja bakti untuk membersihkan saluran air yang tersumbat. Kegiatan ini diinisiasi oleh pemerintah desa sebagai respons atas laporan warga mengenai seringnya terjadi genangan air. Dengan semangat kebersamaan, saluran air utama kini kembali lancar. Terima kasih kepada semua warga yang telah berpartisipasi!',
    authorUid: 'admin01',
    status: 'published',
    publishedAt: '2023-09-20T00:00:00Z',
    tags: ['Kerja Bakti', 'Infrastruktur'],
    coverImage: 'https://picsum.photos/seed/post01/800/400',
  },
  {
    id: 'post02',
    title: 'Pemasangan Lampu Jalan Tenaga Surya di 5 Titik',
    slug: 'pemasangan-lampu-jalan-tenaga-surya',
    body: 'Pemerintah desa telah menyelesaikan pemasangan 5 unit lampu jalan tenaga surya di beberapa titik strategis yang sebelumnya gelap. Program ini bertujuan untuk meningkatkan keamanan dan kenyamanan warga di malam hari. Pemasangan ini merupakan bagian dari alokasi dana desa untuk pembangunan infrastruktur berkelanjutan. Warga diharapkan dapat ikut menjaga fasilitas yang telah disediakan.',
    authorUid: 'admin01',
    status: 'published',
    publishedAt: '2023-09-28T00:00:00Z',
    tags: ['Pembangunan', 'Keamanan'],
    coverImage: 'https://picsum.photos/seed/post02/800/400',
  },
];

export const comments: Comment[] = [
    {
        id: 'comment01',
        postId: 'post01',
        userId: 'warga01',
        text: 'Mantap! Semoga desa kita makin bersih dan bebas banjir.',
        createdAt: '2023-09-20T10:00:00Z',
    }
];
