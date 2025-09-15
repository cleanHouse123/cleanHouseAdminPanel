export enum OrderStatus {
  NEW = 'new',
  PAID = 'paid',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELED = 'canceled',
}

export interface CreateOrderDto {
  customerId: string;
  description: string;
  address: string;
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  currierId?: string;
}

export interface OrderResponseDto {
  id: string;
  customerId: string;
  currierId?: string;
  description: string;
  address: string;
  scheduledAt?: string;
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: OrderStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  currier?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface OrdersListResponse {
  orders: OrderResponseDto[];
  total: number;
}


export interface TakeOrderDto {
  courierId: string;
}

export interface StartOrderDto {
  courierId: string;
}

export interface CompleteOrderDto {
  courierId: string;
}

export interface CancelOrderDto {
  courierId: string;
  reason?: string;
}