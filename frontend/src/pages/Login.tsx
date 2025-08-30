import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Alert, Card, Container, Row, Col } from 'react-bootstrap';

interface LoginForm {
  emailOrLogin: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id: number;
  };
}

function Login(): React.ReactElement {
  const [formData, setFormData] = useState<LoginForm>({
    emailOrLogin: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.emailOrLogin || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post<LoginResponse>('/api/auth/login', {
        email_or_login: formData.emailOrLogin,
        password: formData.password
      });

      const { token, user } = response.data;

      // Salvar token e dados do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('selectedCompanyId', user.company_id.toString());

      setLoading(false);
      
      // Redirecionar para seleção de empresa ou dashboard
      navigate('/company-selection');
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 401) {
        setError('Email/Login ou senha incorretos');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="logo-container mb-3">
                  <div className="logo-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    🏥
                  </div>
                </div>
                <h2 className="mb-2">Sistema de Gestão Clínica</h2>
                <p className="text-muted">Faça login para continuar</p>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email ou Login</Form.Label>
                  <Form.Control
                    type="text"
                    name="emailOrLogin"
                    value={formData.emailOrLogin}
                    onChange={handleInputChange}
                    placeholder="Digite seu email ou login"
                    required
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Digite sua senha"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  © 2024 Sistema de Gestão Clínica. Todos os direitos reservados.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

             <style>{`
         .login-container {
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
           min-height: 100vh;
         }
         
         .logo-container {
           margin-bottom: 1.5rem;
         }
         
         .card {
           border: none;
           border-radius: 15px;
         }
         
         .form-control {
           border-radius: 8px;
           border: 1px solid #e1e5e9;
           padding: 12px 16px;
         }
         
         .form-control:focus {
           border-color: #667eea;
           box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
         }
         
         .btn-primary {
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
           border: none;
           border-radius: 8px;
           padding: 12px;
           font-weight: 600;
         }
         
         .btn-primary:hover {
           background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
           transform: translateY(-1px);
           box-shadow: 0 4px 8px rgba(0,0,0,0.1);
         }
         
         .btn-primary:disabled {
           background: #6c757d;
           transform: none;
           box-shadow: none;
         }
       `}</style>
    </Container>
  );
}

export default Login;
