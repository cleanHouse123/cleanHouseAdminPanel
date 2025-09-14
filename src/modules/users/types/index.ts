import { UserRole } from "@/core/types/user";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  phone: string;
}

export interface FindUsersQueryDto {
  name?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}