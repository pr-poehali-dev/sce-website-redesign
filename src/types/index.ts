export type UserRole = 'admin' | 'moderator' | 'researcher' | 'reader';
export type UserStatus = 'active' | 'pending' | 'blocked';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  clearanceLevel: number;
  createdAt: string;
}

export interface SCEObject {
  id: string;
  code: string;
  name: string;
  objectClass: 'безопасный' | 'евклид' | 'кетер' | 'таумиэль' | 'нейтрализованный';
  containmentProcedures: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  requiredClearance: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: 'news' | 'research' | 'report' | 'announcement';
  createdAt: string;
  updatedAt: string;
  requiredClearance: number;
}

export interface Position {
  id: string;
  name: string;
  description: string;
  clearanceLevel: number;
  permissions: string[];
}