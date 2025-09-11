export interface ApiError {
    response?: {
        data?: {
            message?: string
        }
        status?: number
    }
    message: string
}


export interface PaginationResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}