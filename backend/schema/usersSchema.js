import * as yup from 'yup';

// Função para validar CPF - primeiras aulas na udemy
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Schema para criação de usuário
export const createUserSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  login: yup
    .string()
    .required('Login é obrigatório')
    .min(3, 'Login deve ter pelo menos 3 caracteres')
    .max(50, 'Login deve ter no máximo 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Login deve conter apenas letras, números e underscore'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('cpf', 'CPF inválido', validateCPF),
  
  phone: yup
    .string()
    .nullable()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .matches(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números, espaços, parênteses, hífens e +'),
  
  role: yup
    .string()
    .required('Função é obrigatória')
    .oneOf(['DOCTOR', 'RECEPTIONIST'], 'Função deve ser DOCTOR ou RECEPTIONIST'),
  
  root: yup
    .boolean()
    .default(false)

});



// Schema para atualização de usuário (campos opcionais)
export const updateUserSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: yup
    .string()
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  login: yup
    .string()
    .min(3, 'Login deve ter pelo menos 3 caracteres')
    .max(50, 'Login deve ter no máximo 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Login deve conter apenas letras, números e underscore'),
  
  cpf: yup
    .string()
    .test('cpf', 'CPF inválido', validateCPF),
  
  phone: yup
    .string()
    .nullable()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .matches(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números, espaços, parênteses, hífens e +'),
  
  role: yup
    .string()
    .oneOf(['DOCTOR', 'RECEPTIONIST'], 'Função deve ser DOCTOR ou RECEPTIONIST'),
  
  root: yup
    .boolean()
});

// Schema para listagem de usuários (filtros)
export const listUsersSchema = yup.object({
  name: yup
    .string()
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  role: yup
    .string()
    .oneOf(['DOCTOR', 'RECEPTIONIST'], 'Função deve ser DOCTOR ou RECEPTIONIST'),
  
  page: yup
    .number()
    .positive('Página deve ser positiva')
    .integer('Página deve ser um número inteiro')
    .default(1),
  
  limit: yup
    .number()
    .positive('Limite deve ser positivo')
    .integer('Limite deve ser um número inteiro')
    .max(100, 'Limite máximo é 100')
    .default(10)
});