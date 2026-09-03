export interface PaginationDto {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
}