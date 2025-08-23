export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  email: string;
  password: string;
  avatarUrl?: string;
  projects: string[];
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}
