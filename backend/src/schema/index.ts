import * as yup from 'yup';

// Schemas temporários - serão implementados conforme necessário
export const loginSchema = yup.object({
  email_or_login: yup.string().required('Email ou Login é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Senha atual é obrigatória'),
  newPassword: yup.string().required('Nova senha é obrigatória')
});

export const resetPasswordSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório')
});

// Outros schemas serão adicionados conforme necessário
export const userSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  login: yup.string().required('Login é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
  cpf: yup.string().required('CPF é obrigatório'),
  phone: yup.string().optional(),
  role: yup.string().oneOf(['DOCTOR', 'RECEPTIONIST']).required('Role é obrigatório'),
  root: yup.boolean().optional(),
  company_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Empresa é obrigatória')
});

export const companySchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  zip_code: yup.string().required('CEP é obrigatório'),
  adress_street: yup.string().required('Rua é obrigatória'),
  adress_number: yup.string().required('Número é obrigatório'),
  adress_neighborhood: yup.string().required('Bairro é obrigatório'),
  adress_city: yup.string().required('Cidade é obrigatória'),
  adress_state: yup.string().required('Estado é obrigatório')
});

export const patientSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().optional(),
  birth_date: yup.string().required('Data de nascimento é obrigatória'),
  company_id: yup.number().required('Empresa é obrigatória')
});

export const placeSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  company_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Empresa é obrigatória')
});

export const attendanceSchema = yup.object({
  user_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Usuário é obrigatório'),
  company_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Empresa é obrigatória'),
  start_date: yup.string().required('Data de início é obrigatória').transform((value) => {
    if (value) {
      return new Date(value);
    }
    return value;
  }),
  patient_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Paciente é obrigatório'),
  place_id: yup.number().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  }).required('Local é obrigatório')
});
