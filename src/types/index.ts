export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  email: string;
  password: string;
  avatarUrl?: string;
  connectionCount : number;
  createdAt: string;
  updatedAt: string;
}
