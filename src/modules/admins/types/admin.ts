import { UserRole } from "@/core/types/user";


export interface Admin {
  id: string;
  role: UserRole.ADMIN;
  name: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}