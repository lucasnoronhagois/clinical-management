import { Request, Response, NextFunction } from 'express';
import { Schema } from 'yup';

interface ValidationError {
  name: string;
  inner: Array<{
    path: string;
    message: string;
    value: any;
  }>;
}

/**
 * Middleware para validar dados usando schemas do Yup
 * @param schema - Schema do Yup para validação
 * @param source - Fonte dos dados ('body', 'query', 'params')
 * @returns Middleware do Express
 */
export const validateSchema = (schema: Schema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const validationError = error as ValidationError;
      
      if (validationError.name === 'ValidationError') {
        // formatar os erros de validação
        const errors = validationError.inner.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));
        
        res.status(400).json({
          error: 'Dados inválidos',
          details: errors,
          message: 'Verifique os dados enviados e tente novamente'
        });
        return;
      }
      
      // Erro interno do servidor
      console.error('Erro de validação:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro durante a validação dos dados'
      });
    }
  };
};
