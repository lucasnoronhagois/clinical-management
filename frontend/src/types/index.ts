// Tipos para usuários
export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  cpf: string;
  phone?: string;
  role: 'DOCTOR' | 'RECEPTIONIST';
  root: boolean;
  company_id: number;
  is_deleted: boolean;
}

// Tipos para empresas
export interface Company {
  id: number;
  name: string;
  email: string;
  zip_code: string;
  adress_street: string;
  adress_number: string;
  adress_complement?: string;
  adress_neighborhood: string;
  adress_city: string;
  adress_state: string;
  is_deleted: boolean;
}

// Tipos para pacientes
export interface Patient {
  id: number;
  name: string;
  cpf?: string;
  birth_date: string;
  company_id: number;
  is_deleted: boolean;
  created_at: string;
  company?: Company;
}

// Tipos para locais
export interface Place {
  id: number;
  name: string;
  company_id: number;
  is_deleted: boolean;
}

// Tipos para atendimentos
export interface Attendance {
  id: number;
  confirmed_at?: string;
  confirmed_by?: number;
  receptionist_id?: number;
  user_id: number;
  company_id: number;
  start_date: string;
  end_date?: string;
  patient_id: number;
  place_id: number;
  is_deleted: boolean;
  patient?: Patient;
  user?: User;
  receptionist?: User;
  place?: Place;
}

// Tipos para formulários
export interface LoginForm {
  login: string;
  password: string;
}

export interface CreateUserForm {
  name: string;
  email: string;
  login: string;
  password: string;
  cpf: string;
  phone?: string;
  role: 'DOCTOR' | 'RECEPTIONIST';
  company_id: number;
}

export interface CreateCompanyForm {
  name: string;
  email: string;
  zip_code: string;
  adress_street: string;
  adress_number: string;
  adress_complement?: string;
  adress_neighborhood: string;
  adress_city: string;
  adress_state: string;
}

export interface CreatePatientForm {
  name: string;
  cpf?: string;
  birth_date: string;
  company_id: number;
}

export interface CreatePlaceForm {
  name: string;
  company_id: number;
}

export interface CreateAttendanceForm {
  user_id: number;
  company_id: number;
  start_date: string;
  patient_id: number;
  place_id: number;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (loginData: LoginForm) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
