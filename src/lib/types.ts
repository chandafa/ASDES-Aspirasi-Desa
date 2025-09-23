import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  name: string;
  email: string;
  role: 'warga' | 'admin';
  avatarUrl: string;
  preferences: {
    theme: 'light' | 'dark';
  };
  createdAt: string;
  updatedAt: string;
};

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
export type ReportPriority = 'rendah' | 'sedang' | 'tinggi';

export type ReportComment = {
  userUid: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string; // ISO String for Firestore compatibility
};

export type Report = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Jalan Rusak' | 'Jembatan Patah' | 'Drainase Mampet' | 'Lampu Jalan' | 'Lainnya';
  priority: ReportPriority;
  photos: string[];
  createdBy: string; // uid
  createdAt: string; // Changed from Timestamp to string
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: ReportStatus;
  timeline?: {
    actorUid: string;
    action: string;
    message: string;
    timestamp: string;
  }[];
  comments?: ReportComment[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  authorUid: string;
  status: 'published' | 'draft';
  publishedAt: string;
  tags: string[];
  coverImage: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
};
