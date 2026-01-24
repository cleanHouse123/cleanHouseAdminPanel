import { axiosInstance } from "@/core/config/axios";
import {
  CreateOrderDto,
  OrderResponseDto,
  OrdersListResponse,
  UpdateOrderStatusDto,
  TakeOrderDto,
  StartOrderDto,
  CompleteOrderDto,
  CancelOrderDto,
  ReassignOrderDto,
  OrderStatus,
} from "../types/orders";
import { AxiosResponse } from "axios";

export const ordersApi = {
  create: (data: CreateOrderDto) =>
    axiosInstance
      .post<CreateOrderDto, AxiosResponse<OrderResponseDto>>("/orders", data)
      .then((res) => res.data),

  findAll: (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    customerId?: string;
    currierId?: string;
    startScheduledAtDate?: string;
    endScheduledAtDate?: string;
    sortOrder?: "ASC" | "DESC";
    isOverdue?: boolean;
    customerSearch?: string;
  }) =>
    axiosInstance
      .get<OrdersListResponse>("/orders", { params })
      .then((res) => res.data),

  findOne: (id: string) =>
    axiosInstance
      .get<OrderResponseDto>(`/orders/${id}`)
      .then((res) => res.data),

  updateStatus: (id: string, data: UpdateOrderStatusDto) =>
    axiosInstance
      .patch<UpdateOrderStatusDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/status`,
        data
      )
      .then((res) => res.data),

  remove: (id: string) =>
    axiosInstance.delete(`/orders/${id}`).then(() => undefined),

  // ==================== COURIER OPERATIONS ====================

  takeOrder: (id: string, data: TakeOrderDto) =>
    axiosInstance
      .patch<TakeOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/take`,
        data
      )
      .then((res) => res.data),

  startOrder: (id: string, data: StartOrderDto) =>
    axiosInstance
      .patch<StartOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/start`,
        data
      )
      .then((res) => res.data),

  completeOrder: (id: string, data: CompleteOrderDto) =>
    axiosInstance
      .patch<CompleteOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/complete`,
        data
      )
      .then((res) => res.data),

  cancel: (id: string, data: CancelOrderDto) =>
    axiosInstance
      .patch<CancelOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/cancel`,
        data
      )
      .then((res) => res.data),

  reassignOrder: (id: string, data: ReassignOrderDto) =>
    axiosInstance
      .patch<ReassignOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/reassign`,
        data
      )
      .then((res) => res.data),

};
