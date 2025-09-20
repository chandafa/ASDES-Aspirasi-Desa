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

// Mock reports are now removed and will be fetched from Firestore.
export const reports: Report[] = [];

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

    