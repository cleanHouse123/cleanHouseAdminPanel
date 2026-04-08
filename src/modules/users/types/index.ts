import { UserRole } from "@/core/types/user";

export type UserDeletedFilter = "active" | "deleted" | "all";

export interface User {
  id: string;
  roles: UserRole[];
  name: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  telegramUsername?: string | null;
  deletedAt?: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  phone: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  email?: string;
  roles?: UserRole[];
}

export interface FindUsersQueryDto {
  name?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  deleted?: UserDeletedFilter;
  page?: number;
  limit?: number;
}
