import * as yup from 'yup';

// Schema para dados do dashboard
export const dashboardDataSchema = yup.object({
  company_id: yup
    .number()
    .required('ID da empresa é obrigatório')
    .positive('ID da empresa deve ser positivo')
    .integer('ID da empresa deve ser um número inteiro'),

  // period: yup
  //   .string()
  //   .oneOf(['day', 'week', 'month', 'year'], 'Período deve ser day, week, month ou year')
  //   .default('month'),

  // start_date: yup
  //   .date()
  //   .nullable()
  //   .max(new Date(), 'Data de início não pode ser no futuro'),

  // end_date: yup
  //   .date()
  //   .nullable()
  //   .max(new Date(), 'Data de fim não pode ser no futuro')
  //   .test('end_date', 'Data de fim deve ser posterior à data de início', function (value) {
  //     const { start_date } = this.parent;
  //     if (start_date && value && new Date(value) <= new Date(start_date)) {
  //       return false;
  //     }
  //     return true;
  //   }),
});


/* daqui pra baixo não tem função do modo que construí o projeto.
o dashboard automaticamente traz resultados apenas da company que estou "logado",
logo trazer por company_id é redundante.
De todo modo, deixo pronto e disponível caso precise mudar depois e de algum modo fazer um
comparativo entre as empresas (companies).

Daria para criar um comparativo de tempo de atendimento, demora e até avaliação do cliente
*/

// Schema para estatísticas de atendimentos
export const attendanceStatsSchema = yup.object({
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
    .test('end_date', 'Data de fim deve ser posterior à data de início', function (value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    }),

  group_by: yup
    .string()
    .oneOf(['day', 'week', 'month', 'user', 'place', 'patient'], 'Agrupamento deve ser day, week, month, user, place ou patient')
    .default('day')
});

// Schema para métricas de performance
export const performanceMetricsSchema = yup.object({
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
    .test('end_date', 'Data de fim deve ser posterior à data de início', function (value) {
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

  metrics: yup
    .array()
    .of(yup.string().oneOf(['attendance_count', 'confirmation_rate', 'avg_duration', 'patient_satisfaction']))
    .min(1, 'Pelo menos uma métrica deve ser selecionada')
    .default(['attendance_count'])
});