export interface ProfileItem {
  avatar: string;
  followers: number;
  following: number;
  username: string;
  bio: string;
  nickname: string;
  likes: number;
  videos: number;
}

export interface VideoItem {
  commentCount: number;
  cover: string;
  id: string;
  diggCount: number;
  title: string;
  playCount: number;
  shareCount: number;
}

export interface TiktokDataProps {
  success: boolean;
  data: {
    profile: ProfileItem;
    videos: VideoItem[];
  }
}
