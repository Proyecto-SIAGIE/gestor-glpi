export interface IGenericResponse<T> {
    success: boolean;
    data?: T;
    code?: number;
    messages?: string[];
}

export interface IPaginatedRequest {
    page: number;
    size: number;
    sortBy: string,
    sortOrder: sortOrder
}

export enum sortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

//con 2 campos: sortBy (campo), sortOrder (ASC o DESC)
export interface IPaginatedResponse<T> {
    success: boolean;
    items?: Array<T>;
    recordsTotal: number;
    page: number;
    size: number;
}

