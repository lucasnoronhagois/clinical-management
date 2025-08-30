import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Pagination, Modal, Button, Alert, Table, Card, Row, Col } from 'react-bootstrap';
import { contemTexto } from '../utils/stringUtils';

interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  cpf: string;
  phone?: string;
  role: string;
  root: boolean;
  company_id: number;
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  email: string;
  login: string;
  password: string;
  cpf: string;
  phone: string;
  role: string;
  root: boolean;
  company_id: string;
}

interface Filters {
  name: string;
  role: string;
}

function Users(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Filters>({ name: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    login: '',
    password: '',
    cpf: '',
    phone: '',
    role: 'RECEPTIONIST',
    root: false,
    company_id: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedCompanyId) {
      navigate('/company-selection');
      return;
    }
    setLoading(true);
    axios.get(`/api/users?company_id=${selectedCompanyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.error) setError(res.data.error);
        else {
          const usuarios = Array.isArray(res.data.users) ? res.data.users : [];
          setAllUsers(usuarios);
          setUsers(usuarios);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.data?.error === 'Token não fornecido.') {
          localStorage.removeItem('token');
          setError('Sua sessão expirou ou o token não foi reconhecido. Faça login novamente.');
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        setError('Erro ao buscar usuários');
        setLoading(false);
      });
  }, [navigate]);

  // Filtro local
  useEffect(() => {
    if (allUsers.length > 0) {
      const filtrados = allUsers.filter(user => {
        const nome = user.name || '';
        const busca = filters.name;
        return (
          (filters.name === '' || contemTexto(nome, busca)) &&
          (filters.role === '' || user.role === filters.role)
        );
      });
      setUsers(filtrados);
      setCurrentPage(1);
    }
  }, [filters, allUsers]);

  // paginação local
  const usersParaExibir = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // navegação
  const proximaPagina = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const paginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const irParaPagina = (pagina: number): void => {
    if (pagina > 0 && pagina <= Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(pagina);
    }
  };

  // Filtros
  const handleFilterChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Modais
  const handleShowCreate = (): void => {
    setFormData({
      name: '',
      email: '',
      login: '',
      password: '',
      cpf: '',
      phone: '',
      role: 'DOCTOR',
      root: false,
      company_id: localStorage.getItem('selectedCompanyId') || ''
    });
    setShowCreateModal(true);
  };
  const handleShowEdit = async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setFormData(res.data);
      setShowEditModal(true);
    } catch (err: any) {
      setError('Erro ao buscar usuário para edição.');
    }
  };
  const handleShowDelete = (userId: number): void => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };
  const handleFormChange = (e: React.ChangeEvent<any>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const isEditing = showEditModal;
      const url = isEditing ? `/api/users/${(formData as any).id}` : '/api/users';
      const method = isEditing ? 'put' : 'post';
      const dataToSend = {
        ...formData,
        company_id: formData.company_id || localStorage.getItem('selectedCompanyId')
      };
      await axios[method](url, dataToSend, { headers: { Authorization: `Bearer ${token}` } });
      setShowCreateModal(false);
      setShowEditModal(false);
      // atualiza lista
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      const res = await axios.get(`/api/users?company_id=${selectedCompanyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(Array.isArray(res.data.users) ? res.data.users : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar usuário.');
    }
  };
  const handleDelete = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${deleteUserId}`, { headers: { Authorization: `Bearer ${token}` } });
      setShowDeleteModal(false);
      setDeleteUserId(null);
      // atualiza lista
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      const res = await axios.get(`/api/users?company_id=${selectedCompanyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(Array.isArray(res.data.users) ? res.data.users : []);
    } catch (err: any) {
      setError('Erro ao deletar usuário.');
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Usuários</h2>
        <div>
          <Button variant="primary" className="me-2" onClick={handleShowCreate}>
            Novo Usuário
          </Button>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Form.Control
          name="name"
          placeholder="Buscar por nome..."
          value={filters.name}
          onChange={handleFilterChange}
          style={{ flex: 1 }}
        />
        <Form.Select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          style={{ width: 200 }}
        >
          <option value="">Todos os tipos</option>
          <option value="DOCTOR">Médico</option>
          <option value="RECEPTIONIST">Recepcionista</option>
        </Form.Select>
      </div>

      {usersParaExibir.length === 0 ? (
        <p>Nenhum usuário encontrado</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Login</th>
                <th>Função</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Administrador</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usersParaExibir.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.login}</td>
                  <td>{user.role === 'DOCTOR' ? 'Médico' : user.role === 'RECEPTIONIST' ? 'Recepcionista' : 'Administrador'}</td>
                  <td>{user.cpf}</td>
                  <td>{user.phone}</td>
                  <td>{user.root ? 'Sim' : 'Não'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <Button variant="info" size="sm" onClick={() => handleShowEdit(user.id)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleShowDelete(user.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          {Math.ceil(users.length / usersPerPage) > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <Pagination>
                <Pagination.First 
                  onClick={() => irParaPagina(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={paginaAnterior} 
                  disabled={currentPage === 1}
                />
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => irParaPagina(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={proximaPagina} 
                  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                />
                <Pagination.Last 
                  onClick={() => irParaPagina(Math.ceil(users.length / usersPerPage))} 
                  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal Criar/Editar */}
      <Modal show={showCreateModal || showEditModal} onHide={() => { setShowCreateModal(false); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{showEditModal ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="name" type="text" required value={formData.name || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" required value={formData.email || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Login</Form.Label>
              <Form.Control name="login" type="text" required value={formData.login || ''} onChange={handleFormChange} />
            </Form.Group>
            {!showEditModal && (
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control name="password" type="password" required value={formData.password || ''} onChange={handleFormChange} />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control name="cpf" type="text" required value={formData.cpf || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control name="phone" type="text" value={formData.phone || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Função</Form.Label>
              <Form.Select name="role" required value={formData.role || ''} onChange={handleFormChange}>
                <option value="DOCTOR">Médico</option>
                <option value="RECEPTIONIST">Recepcionista</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Administrador" checked={formData.root || false} onChange={handleFormChange} name="root" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Excluir */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este usuário?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users; 