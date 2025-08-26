import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { LoginForm } from '../types';

interface LoginResponse {
  token: string;
  error?: string;
}

interface TokenPayload {
  root: boolean;
  company_id: number;
}

function Login(): React.ReactElement {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    try {
      const loginData: LoginForm = { login: emailOrLogin, password };
      const res = await axios.post<LoginResponse>('/api/auth/login', loginData);
      
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // verificar se é root (adm)
        const tokenPayload: TokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
        const isRoot = tokenPayload.root;
        
        if (isRoot) {
          // se root, vai para seleção de empresa
          navigate('/company-selection');
        } else {
          // se não é root, define a empresa automaticamente baseada no banco e vai para dashboard
          localStorage.setItem('selectedCompanyId', tokenPayload.company_id.toString());
          navigate('/dashboard');
        }
      } else {
        setError(res.data.error || 'Erro ao fazer login');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro de conexão');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email ou Login"
          value={emailOrLogin}
          onChange={e => setEmailOrLogin(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <Button variant="primary" type="submit" style={{ width: '100%' }}>Entrar</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
