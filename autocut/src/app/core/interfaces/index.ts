export interface ILoginResponse {
  token: string;
  expiresIn: number; 
  authUser: IUser; 
}

export interface IResponse<T> {
  data: T;
  message: string;
  meta: {
    page?: number;
    size?: number;
    totalPages?: number;
    totalElements?: number;
  };
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string; 
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN_ROLE'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}

export interface ITestimonial {
  authorName: string;
  authorLogo: string;
  testimonial: string;
}

export interface IStat {
  icon: string;
  value: string;
  label: string;
}

export interface IVehiculo {
  marca: string;
  modelo: string;
  categoria: string;
  anio: string;
  confianza: number;
  imagenURL: string;
}
