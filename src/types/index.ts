export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  email: string;
  password: string;
  avatarUrl?: string;
  connectionCount: number;
  createdAt: string;
  updatedAt: string;
}

export type connectionType = {
  _id: string;
  createdAt: string;
  receiverId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  senderId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  status: "interested" | "ignored" | "accepted" | "rejected";
  updatedAt: string;
};
