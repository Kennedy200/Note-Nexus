export interface User {
  id: string;
  username: string;
  email: string;
  coin_balance: number;
  avatar_url?: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  course_code: string;
  department: string;
  uploader_name: string;
  price: number; // 0 for free, >0 for premium
  rating: number;
  download_count: number;
  created_at: string;
}