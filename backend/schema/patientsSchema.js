import * as yup from 'yup';

// Função para validar CPF (reutilizada do usersSchema)
const validateCPF = (cpf) => {
  if (!cpf) return true; // CPF é opcional para pacientes
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Função para validar data de nascimento
const validateBirthDate = (date) => {
  if (!date) return false;
  
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Verifica se a data é válida
  if (isNaN(birthDate.getTime())) return false;
  
  // Verifica se não é uma data futura
  if (birthDate > today) return false;
  
  // Verifica o range da idade (entre 0 e 150 anos)
  if (age < 0 || age > 150) return false;
  
  return true;
};

// Schema para criação de paciente
export const createPatientSchema = yup.object({
  name: yup
    .string()
    .required('Nome do paciente é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  cpf: yup
    .string()
    .nullable()
    .test('cpf', 'CPF inválido', validateCPF)
    .transform((value) => value ? value.replace(/\D/g, '') : null),
  
  birth_date: yup
    .date()
    .required('Data de nascimento é obrigatória')
    .test('birth_date', 'Data de nascimento inválida', validateBirthDate)
    .max(new Date(), 'Data de nascimento não pode ser no futuro'),
  
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro')
});

// Schema para atualização de paciente (campos opcionais)
export const updatePatientSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  cpf: yup
    .string()
    .nullable()
    .test('cpf', 'CPF inválido', validateCPF)
    .transform((value) => value ? value.replace(/\D/g, '') : null),
  
  birth_date: yup
    .date()
    .test('birth_date', 'Data de nascimento inválida', validateBirthDate)
    .max(new Date(), 'Data de nascimento não pode ser no futuro'),
  
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro')
});

// Schema para listagem de pacientes (filtros)
export const listPatientsSchema = yup.object({
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  name: yup
    .string()
    .max(150, 'Nome deve ter no máximo 150 caracteres'),
  
  cpf: yup
    .string()
    .nullable()
    .test('cpf', 'CPF inválido', validateCPF)
    .transform((value) => value ? value.replace(/\D/g, '') : null),
  
  birth_date_from: yup
    .date()
    .max(new Date(), 'Data não pode ser no futuro')

});
