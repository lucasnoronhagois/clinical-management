import * as yup from 'yup';

// Schema para relatórios gerais de dashboard
export const dashboardReportSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  period: yup
    .string()
    .oneOf(['day', 'week', 'month', 'year'], 'Período deve ser day, week, month ou year')
    .default('month'),
  
  start_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de início não pode ser no futuro'),
  
  end_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de fim não pode ser no futuro')
    .test('end_date', 'Data de fim deve ser posterior à data de início', function(value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    })
});


/* daqui pra baixo tá sem uso, mas disponível.
o schema fica pronto para caso eu queira posteriormente reports específicos
de atendimentos, pacientes, usuários e places
*/


// Schema para relatórios de atendimentos
export const attendanceReportSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  start_date: yup
    .date()
    .required('Data de início é obrigatória')
    .max(new Date(), 'Data de início não pode ser no futuro'),
  
  end_date: yup
    .date()
    .required('Data de fim é obrigatória')
    .max(new Date(), 'Data de fim não pode ser no futuro')
    .test('end_date', 'Data de fim deve ser posterior à data de início', function(value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    }),
  
  user_id: yup
    .number()
    .nullable()
    .positive('ID do usuário deve ser positivo')
    .integer('ID do usuário deve ser um número inteiro'),
  
  patient_id: yup
    .number()
    .nullable()
    .positive('ID do paciente deve ser positivo')
    .integer('ID do paciente deve ser um número inteiro'),
  
  place_id: yup
    .number()
    .nullable()
    .positive('ID do local deve ser positivo')
    .integer('ID do local deve ser um número inteiro'),
  
  confirmed: yup
    .boolean()
    .nullable(),
  
  format: yup
    .string()
    .oneOf(['json', 'csv', 'pdf'], 'Formato deve ser json, csv ou pdf')
    .default('json')
});

// Schema para relatórios de pacientes
export const patientReportSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  start_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de início não pode ser no futuro'),
  
  end_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de fim não pode ser no futuro')
    .test('end_date', 'Data de fim deve ser posterior à data de início', function(value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    }),
  
  age_min: yup
    .number()
    .nullable()
    .min(0, 'Idade mínima deve ser 0 ou maior')
    .max(150, 'Idade mínima deve ser 150 ou menor')
    .integer('Idade deve ser um número inteiro'),
  
  age_max: yup
    .number()
    .nullable()
    .min(0, 'Idade máxima deve ser 0 ou maior')
    .max(150, 'Idade máxima deve ser 150 ou menor')
    .integer('Idade deve ser um número inteiro')
    .test('age_max', 'Idade máxima deve ser maior que a mínima', function(value) {
      const { age_min } = this.parent;
      if (age_min && value && value <= age_min) {
        return false;
      }
      return true;
    }),
  
  format: yup
    .string()
    .oneOf(['json', 'csv', 'pdf'], 'Formato deve ser json, csv ou pdf')
    .default('json')
});

// Schema para relatórios de usuários
export const userReportSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  role: yup
    .string()
    .nullable()
    .oneOf(['DOCTOR', 'RECEPTIONIST'], 'Função deve ser DOCTOR ou RECEPTIONIST'),
  
  root: yup
    .boolean()
    .nullable(),
  
  format: yup
    .string()
    .oneOf(['json', 'csv', 'pdf'], 'Formato deve ser json, csv ou pdf')
    .default('json')
});

// Schema para relatórios de locais
export const placeReportSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),
  
  start_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de início não pode ser no futuro'),
  
  end_date: yup
    .date()
    .nullable()
    .max(new Date(), 'Data de fim não pode ser no futuro')
    .test('end_date', 'Data de fim deve ser posterior à data de início', function(value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    }),
  
  format: yup
    .string()
    .oneOf(['json', 'csv', 'pdf'], 'Formato deve ser json, csv ou pdf')
    .default('json')
});


