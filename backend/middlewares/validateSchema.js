/**
 * Middleware para validar dados usando schemas do Yup
 * @param {Object} schema - Schema do Yup para validação
 * @param {string} source - Fonte dos dados ('body', 'query', 'params')
 * @returns {Function} Middleware do Express
 */
export const validateSchema = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = req[source];
      
      // Valida os dados usando o schema
      const validatedData = await schema.validate(data, {
        abortEarly: false, // todos os erros, não apenas o primeiro
        stripUnknown: true, // remover campos não definidos no schema
        strict: false // permitir campos extras
      });
      
      // substituir os dados originais pelos validados
      req[source] = validatedData;
      
      next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // formatar os erros de validação
        const errors = error.inner.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));
        
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors,
          message: 'Verifique os dados enviados e tente novamente'
        });
      }
      
      // Erro interno do servidor
      console.error('Erro de validação:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro durante a validação dos dados'
      });
    }
  };
};