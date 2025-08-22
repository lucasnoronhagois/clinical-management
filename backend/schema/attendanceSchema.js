import * as yup from 'yup';

// Função para validar datas de atendimento
const validateAttendanceDates = function(value) {
  const { start_date } = this.parent;
  
  if (!start_date || !value) return true;
  
  const start = new Date(start_date);
  const end = new Date(value);
  
  return end > start;
};

// Schema para criação de atendimento
export const createAttendanceSchema = yup.object({
  user_id: yup
    .number()
    .required('ID do usuário é obrigatório')
    .positive('ID do usuário deve ser positivo')
    .integer('ID do usuário deve ser um número inteiro'),
  
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  start_date: yup
    .date()
    .required('Data de início é obrigatória')
    .min(new Date(), 'Data de início não pode ser no passado'),
  
  end_date: yup
    .date()
    .nullable()
    .test('end_date', 'Data de fim deve ser posterior à data de início', validateAttendanceDates),
  
  patient_id: yup
    .number()
    .required('ID do paciente é obrigatório')
    .positive('ID do paciente deve ser positivo')
    .integer('ID do paciente deve ser um número inteiro'),
  
  place_id: yup
    .number()
    .required('ID do local é obrigatório')
    .positive('ID do local deve ser positivo')
    .integer('ID do local deve ser um número inteiro'),
  
  receptionist_id: yup
    .number()
    .nullable()
    .positive('ID do recepcionista deve ser positivo')
    .integer('ID do recepcionista deve ser um número inteiro'),
  
  confirmed_by: yup
    .number()
    .nullable()
    .positive('ID do usuário que confirmou deve ser positivo')
    .integer('ID do usuário que confirmou deve ser um número inteiro')
});

// Schema para atualização de atendimento (campos opcionais)
export const updateAttendanceSchema = yup.object({
  user_id: yup
    .number()
    .positive('ID do usuário deve ser positivo')
    .integer('ID do usuário deve ser um número inteiro'),
  
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  start_date: yup
    .date()
    .min(new Date(), 'Data de início não pode ser no passado'),
  
  end_date: yup
    .date()
    .nullable()
    .test('end_date', 'Data de fim deve ser posterior à data de início', validateAttendanceDates),
  
  patient_id: yup
    .number()
    .positive('ID do paciente deve ser positivo')
    .integer('ID do paciente deve ser um número inteiro'),
  
  place_id: yup
    .number()
    .positive('ID do local deve ser positivo')
    .integer('ID do local deve ser um número inteiro'),
  
  receptionist_id: yup
    .number()
    .nullable()
    .positive('ID do recepcionista deve ser positivo')
    .integer('ID do recepcionista deve ser um número inteiro'),
  
  confirmed_by: yup
    .number()
    .nullable()
    .positive('ID do usuário que confirmou deve ser positivo')
    .integer('ID do usuário que confirmou deve ser um número inteiro'),
  
  confirmed_at: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de confirmação não pode ser no futuro')
});

// Schema para listagem de atendimentos (filtros)
export const listAttendancesSchema = yup.object({
  company_id: yup
    .number()
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  user_id: yup
    .number()
    .positive('ID do usuário deve ser positivo')
    .integer('ID do usuário deve ser um número inteiro'),
  
  patient_id: yup
    .number()
    .positive('ID do paciente deve ser positivo')
    .integer('ID do paciente deve ser um número inteiro'),
  
  place_id: yup
    .number()
    .positive('ID do local deve ser positivo')
    .integer('ID do local deve ser um número inteiro'),
  
  start_date_from: yup
    .date()
    .max(new Date(), 'Data não pode ser no futuro'),
  
  start_date_to: yup
    .date()
    .max(new Date(), 'Data não pode ser no futuro')
    .test('start_date_to', 'Data final deve ser maior que a inicial', function(value) {
      const { start_date_from } = this.parent;
      if (start_date_from && value && new Date(value) < new Date(start_date_from)) {
        return false;
      }
      return true;
    }),
  
  confirmed: yup
    .boolean(),
  
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
