import * as yup from 'yup';

// Schema para criação de local
export const createPlaceSchema = yup.object({
  name: yup
    .string()
    .required('Nome do local é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro')
});

// Schema para atualização de local (campos opcionais)
export const updatePlaceSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro')
});

// Schema para listagem de locais (filtros)
export const listPlacesSchema = yup.object({
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  name: yup
    .string()
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
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
