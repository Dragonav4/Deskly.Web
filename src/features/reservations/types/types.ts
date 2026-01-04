import type { ListResponse } from "../../../shared/lib/crud/types.ts";

export interface ReservationCreateDto {
    deskId: string;
    reservationDate: string;
}

export interface ReservationUpdateDto extends ReservationCreateDto {
    id: string;
    actions: number;
}

export interface Reservation extends ReservationUpdateDto {
    //id: string;
    deskId: string;
    reservationDate: string;

    userId: string;
    createdAt: string;

    desk?: {
        deskNumber: string;
        floor: number;
    };
    user?: {
        email: string;
    };
}

export interface ReservationListResponse extends ListResponse<Reservation> {
}