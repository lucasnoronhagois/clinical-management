import * as yup from 'yup';

// schema para validação de IDs
export const idSchema = yup.object({
  id: yup.number()
    .positive('ID deve ser positivo')
    .integer('ID deve ser um número inteiro')
    //.max(99, 'ID muito grande') //99 por agora pra teste, depois aumentar se necessário
    .required('ID é obrigatório')
});

// schema para validação de ID com limite personalizado (caso eu precise depois)
export const createIdSchema = (maxValue = 999999999) => yup.object({
  id: yup.number()
    .positive('ID deve ser positivo')
    .integer('ID deve ser um número inteiro')
    .max(maxValue, `ID não pode ser maior que ${maxValue}`)
    .required('ID é obrigatório')
});

// schema para paginação (posso até tirar posteriormente)
export const paginationSchema = yup.object({
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

// schema para filtros de data (falar com camus se aqui ou no cod)
export const dateRangeSchema = yup.object({
  start_date: yup
    .date()
    .max(new Date(), 'Data de início não pode ser no futuro'),
  
  end_date: yup
    .date()
    .max(new Date(), 'Data de fim não pode ser no futuro')
    .test('end_date', 'Data de fim deve ser posterior à data de início', function(value) {
      const { start_date } = this.parent;
      if (start_date && value && new Date(value) <= new Date(start_date)) {
        return false;
      }
      return true;
    })
}); 