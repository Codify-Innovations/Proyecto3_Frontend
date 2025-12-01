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
    pageNumber?: number;
    pageSize?: number;
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
  name: string;
  updatedAt: string;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
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

export interface IVehicleCustomization {
  id?: number;
  modelo: string;
  carroceria?: string;
  vidriosPolarizados?: boolean;
  interior?: string;
  rines?: string;
  lucesFront?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
export interface IMediaTypeConfig {
  fillType: string;
  propertyPath: string;
  mediaType: 'video' | 'image' | 'audio';
  defaultExtension: string;
}

export interface IMediaUploadState {
  uploadedFiles: Map<string, string>;
  pendingUploads: Map<string, File>;
  isUploading: boolean;
}

export type MediaType = 'video' | 'image' | 'audio';
export interface IVehiculo {
  id?: number;
  marca: string;
  modelo: string;
  categoria: string;
  anio: string;
  imagenURL: string;
  imagenHotWheels?: string;
  color: string
}
export interface ILogro {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string | null;
  criterio: string;
  cantidadRequerida: number;
  activo: boolean;
  iconoUrl: string | null;
}

export interface IUsuarioLogro {
  id: number;
  usuario: number;
  logro: ILogro;
  fechaDesbloqueo: string;
}

export interface IRankingUser {
  userId: number;
  name: string;
  lastname: string;
  totalVehiculos: number;
  totalLogros: number;
}

export interface IGeneratedVideo {
  userId: number;
  imageUrls: string;
  style: string;
  duration: number;
  videoUrl: string;
}

export interface IGeneratedVideoPayload {
  imageUrls: string[];
  style: string;
  duration: number;
  videoUrl: string;
}

export interface IAnalyzedContent {
  userId: number;
  sourceUrl: string;
  analysisType: string;
  score: number;
}

export interface IAnalyzedContentPayload {
  sourceUrl: string;
  analysisType: string;
  score: number;
}

export interface IDateMetrics {
  vehiculos: Record<string, number>;
  videos: Record<string, number>;
  analisis: Record<string, number>;
  logros: Record<string, number>;
}

export interface IUserSummary {
  totalVehiculos: number;
  totalVideosGenerados: number;
  totalContenidoAnalizado: number;
  totalLogrosDesbloqueados: number;
  promedioScoreAnalisis: number;
}
