import { SortDirection } from "./shared";

export interface CreateUnitRequest {
    name: string;
}

export interface UpdateUnitRequest {
    unitOfMeasurementId: number;
    name: string;
}

export interface Unit {
    id: number;
    name: string;
}

export interface GetUnitsRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null; 
    sortOrder: SortDirection | null; 
    name: string | null;
}