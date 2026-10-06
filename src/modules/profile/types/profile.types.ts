/** DTO mentah dari GET /auth/me (snake_case, sesuai respons auth-api) */
export interface MyProfileDto {
  employee_id: string;
  employee_code?: string;
  full_name: string;
  username: string;
  email?: string;
  role?: {
    role_id?: string;
    role_code?: string;
    role_name?: string;
  } | null;
  division?: {
    division_id?: string;
    division_name?: string;
  } | null;
  position?: {
    position_id?: string;
    position_name?: string;
  } | null;
  office?: {
    office_id?: string;
    office_name?: string;
  } | null;
}

/** View model untuk UI (camelCase) */
export interface ProfileViewModel {
  employeeId?: string;
  fullName: string;
  username: string;
  email?: string;
  positionName?: string;
  officeName?: string;
  divisionName?: string;
}

export interface ProfileStats {
  diaries: number;
  customers: number;
  deals: number;
}
