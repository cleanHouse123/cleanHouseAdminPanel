import { useQuery } from "@tanstack/react-query";
import { adminsApi } from "../api";
import { Admin } from "../types/admin";


export const useAdmins = () => {
  return useQuery<Admin[]>({
    queryKey: ['admins'],
    queryFn: () => adminsApi.findAll(),
  });
};
