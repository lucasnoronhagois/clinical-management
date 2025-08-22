import * as yup from 'yup';

// Schema para login
export const loginSchema = yup.object({
  login: yup
    .string()
    .required('Login é obrigatório')
    .min(1, 'Login deve ter pelo menos 3 caracteres') //lembrar de adiciona o min e o max pra novos users
    .max(50, 'Login deve ter no máximo 50 caracteres'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(1, 'Senha deve ter pelo menos 6 caracteres') //min de senha so pra teste
    .max(100, 'Senha deve ter no máximo 100 caracteres')
});

/* aqui posso adicionar um schema para criação de users
ou adicionar direto no schema de users
*/


// Schema para troca de senha
export const changePasswordSchema = yup.object({ //troca de senha ainda nao feita, apenas o schema dela
  currentPassword: yup
    .string()
    .required('Senha atual é obrigatória'),
  
  newPassword: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres')
    .notOneOf([yup.ref('currentPassword')], 'Nova senha deve ser diferente da senha atual'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('newPassword')], 'Senhas devem ser iguais')
});

// Schema para redefinir senha
export const resetPasswordSchema = yup.object({ //reset de senha nao feito, apenas o schema
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido'),
  
  newPassword: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('newPassword')], 'Senhas devem ser iguais')
});
