import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api";
import { 
  CreateOrderDto, 
  UpdateOrderStatusDto, 
  OrderResponseDto, 
  OrdersListResponse,
  OrderStatus,
  TakeOrderDto,
  StartOrderDto,
  CompleteOrderDto,
  CancelOrderDto
} from "../types/orders";


export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
  currierId?: string;
}) => {
  return useQuery<OrdersListResponse>({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.findAll(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery<OrderResponseDto>({
    queryKey: ['order', id],
    queryFn: () => ordersApi.findOne(id),
    enabled: !!id,
  });
};

// ==================== MUTATION HOOKS ====================

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderDto) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) => 
      ordersApi.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ordersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useTakeOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TakeOrderDto }) => 
      ordersApi.takeOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useStartOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StartOrderDto }) => 
      ordersApi.startOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteOrderDto }) => 
      ordersApi.completeOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelOrderDto }) => 
      ordersApi.cancelOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
