import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function Login() {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { login: emailOrLogin, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // verificar se é root (adm)
        const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
        const isRoot = tokenPayload.root;
        
        if (isRoot) {
          // se root, vai para seleção de empresa
          navigate('/company-selection');
        } else {         // se não é root, define a empresa automaticamente baseada no banco e vai para dashboard
          localStorage.setItem('selectedCompanyId', tokenPayload.company_id);
          navigate('/dashboard');
        }
      } else {      setError(res.data.error || 'Erro ao fazer login');
      }
    } catch (err) {
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