export interface WorkTime {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkTimePayload {
  startTime: string;
  endTime: string;
}

