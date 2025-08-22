import * as yup from 'yup';

// Função para validar CEP
const validateCEP = (cep) => {
  cep = cep.replace(/\D/g, '');
  return cep.length === 8;
};

// Schema para criação de empresa
export const createCompanySchema = yup.object({
  name: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  zip_code: yup
    .string()
    .required('CEP é obrigatório')
    .test('cep', 'CEP inválido', validateCEP)
    .transform((value) => value.replace(/\D/g, '')),
  
  adress_street: yup
    .string()
    .required('Rua é obrigatória')
    .min(2, 'Rua deve ter pelo menos 2 caracteres')
    .max(100, 'Rua deve ter no máximo 100 caracteres'),
  
  adress_number: yup
    .string()
    .required('Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  adress_complement: yup
    .string()
    .nullable()
    .max(50, 'Complemento deve ter no máximo 50 caracteres'),
  
  adress_neighborhood: yup
    .string()
    .required('Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),
  
  adress_city: yup
    .string()
    .required('Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  
  adress_state: yup
    .string()
    .required('Estado é obrigatório')
    .length(2, 'Estado deve ter exatamente 2 caracteres')
    .matches(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas (ex: SP, RJ)')
});

// Schema para atualização de empresa (campos opcionais)
export const updateCompanySchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: yup
    .string()
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  zip_code: yup
    .string()
    .test('cep', 'CEP inválido', validateCEP)
    .transform((value) => value.replace(/\D/g, '')),
  
  adress_street: yup
    .string()
    .min(2, 'Rua deve ter pelo menos 2 caracteres')
    .max(100, 'Rua deve ter no máximo 100 caracteres'),
  
  adress_number: yup
    .string()
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  
  adress_complement: yup
    .string()
    .nullable()
    .max(50, 'Complemento deve ter no máximo 50 caracteres'),
  
  adress_neighborhood: yup
    .string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),
  
  adress_city: yup
    .string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  
  adress_state: yup
    .string()
    .length(2, 'Estado deve ter exatamente 2 caracteres')
    .matches(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas (ex: SP, RJ)')
});

// Schema para listagem de empresas (filtros)
export const listCompaniesSchema = yup.object({
  name: yup
    .string()
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: yup
    .string()
    .email('Email deve ser válido'),
  
  city: yup
    .string()
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  
  state: yup
    .string()
    .length(2, 'Estado deve ter exatamente 2 caracteres')
    .matches(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas'),
  
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
