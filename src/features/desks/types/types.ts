import type { ListResponse } from "../../../shared/lib/crud/types.ts";

export interface DeskCreateDto {
  deskNumber: string
  hasDualMonitor: boolean
  isStandingDesk: boolean
  floor: number
}

export interface DeskUpdateDto extends DeskCreateDto {
  id: string,
  actions: number,
}

export interface Desk extends DeskUpdateDto {
}


export interface DeskListResponse extends ListResponse<Desk> {
}
