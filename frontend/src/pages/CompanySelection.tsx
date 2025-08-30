import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function CompanySelection() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    zip_code: '',
    adress_street: '',
    adress_number: '',
    adress_complement: '',
    adress_neighborhood: '',
    adress_city: '',
    adress_state: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const checkUserAndFetchCompanies = async () => {
      try {
        // token para obter informações do usuário
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userRole = tokenPayload.role;
        const userCompanyId = tokenPayload.company_id;
        const isRoot = tokenPayload.root;

        // se não é adm, redireciona automaticamente para a empresa do usuário
        if (!isRoot) {
          localStorage.setItem('selectedCompanyId', userCompanyId);
          navigate('/dashboard');
          return;
        }

        // se é adm, busca todas as empresas
        const response = await axios.get('/api/companies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(response.data);
      } catch (err) {
        if (err.response?.status === 401) {          
          navigate('/login');
        } else {
          setError('Erro ao carregar empresas');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchCompanies();
  }, [navigate]);

  const handleCompanySelect = (companyId) => {
    localStorage.setItem('selectedCompanyId', companyId);
    navigate('/dashboard');
  };

  const handleShowModal = () => {
    setForm({
      name: '',
      email: '',
      zip_code: '',
      adress_street: '',
      adress_number: '',
      adress_complement: '',
      adress_neighborhood: '',
      adress_city: '',
      adress_state: ''
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.name.trim()) {
      setFormError('O nome da empresa é obrigatório.');
      return;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError('Email válido é obrigatório.');
      return;
    }
    if (!form.zip_code.trim() || !/^\d{5}-?\d{3}$/.test(form.zip_code)) {
      setFormError('CEP válido é obrigatório (ex: 12345-678).');
      return;
    }
    if (!form.adress_street.trim()) {
      setFormError('Rua é obrigatória.');
      return;
    }
    if (!form.adress_number.trim()) {
      setFormError('Número do prédio é obrigatório.');
      return;
    }
    if (!form.adress_neighborhood.trim()) {
      setFormError('Bairro é obrigatório.');
      return;
    }
    if (!form.adress_city.trim()) {
      setFormError('Cidade é obrigatória.');
      return;
    }
    if (!form.adress_state.trim()) {
      setFormError('Estado é obrigatório.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/companies', form, { headers: { Authorization: `Bearer ${token}` } });
      setFormSuccess('Empresa cadastrada com sucesso!');
      setShowModal(false);
      // atualiza lista e seleciona nova empresa
      setCompanies(prev => [...prev, res.data]);
      localStorage.setItem('selectedCompanyId', res.data.id);
      navigate('/dashboard');
    } catch (err) {
      setFormError('Erro ao cadastrar empresa.');
    }
  };

  // detalhes
  const handleShowDetails = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/companies/${companyId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedCompany(res.data);
      setShowDetails(true);
    } catch (err) {
      setError('Erro ao buscar detalhes da empresa.');
    }
  };

  // editar
  const handleShowEdit = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/companies/${companyId}`, { headers: { Authorization: `Bearer ${token}` } });
      setEditForm(res.data);
      setEditError('');
      setShowEdit(true);
    } catch (err) {
      setError('Erro ao buscar empresa para edição.');
    }
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/companies/${editForm.id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setShowEdit(false);
      // atualiza lista
      const updated = companies.map(c => c.id === editForm.id ? { ...c, ...editForm } : c);
      setCompanies(updated);
    } catch (err) {
      setEditError('Erro ao atualizar empresa.');
    }
  };

  // deletar
  const handleShowDelete = (companyId) => {
    setDeleteCompanyId(companyId);
    setShowDelete(true);
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/companies/${deleteCompanyId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCompanies(companies.filter(c => c.id !== deleteCompanyId));
      setShowDelete(false);
      setDeleteCompanyId(null);
    } catch (err) {
      setError('Erro ao deletar empresa.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 20 }}>Carregando...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: 20, color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Selecione uma Empresa</h2>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Voltar ao Dashboard
        </button>
      </div>
      <Button variant="primary" className="mb-3" onClick={handleShowModal}>
        Cadastrar nova empresa
      </Button>
      <p>Escolha a empresa para continuar:</p>
      {companies.length === 0 ? (
        <p>Nenhuma empresa encontrada.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {companies.map(company => (
            <div 
              key={company.id}
              style={{
                padding: 15,
                border: '1px solid #ddd',
                borderRadius: 8,
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e9e9e9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleCompanySelect(company.id)}>
                <h3 style={{ margin: '0 0 5px 0' }}>{company.name}</h3>
                {company.cnpj && <p style={{ margin: '5px 0', color: '#666' }}>CNPJ: {company.cnpj}</p>}
                {company.address && <p style={{ margin: '5px 0', color: '#666' }}>Endereço: {company.address}</p>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <Button size="sm" variant="info" onClick={() => handleShowDetails(company.id)}>Detalhes</Button>
                <Button size="sm" variant="warning" onClick={() => handleShowEdit(company.id)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleShowDelete(company.id)}>Excluir</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar nova empresa</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="name" type="text" required value={form.name} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" required value={form.email} onChange={handleFormChange} />
            </Form.Group>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>CEP</Form.Label>
                <Form.Control name="zip_code" type="text" required value={form.zip_code} onChange={handleFormChange} placeholder="12345-678" />
              </Form.Group>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>Complemento</Form.Label>
                <Form.Control name="adress_complement" type="text" value={form.adress_complement} onChange={handleFormChange} />
              </Form.Group>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Group className="mb-3" style={{ flex: 2 }}>
                <Form.Label>Rua</Form.Label>
                <Form.Control name="adress_street" type="text" required value={form.adress_street} onChange={handleFormChange} />
              </Form.Group>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>Número</Form.Label>
                <Form.Control name="adress_number" type="text" required value={form.adress_number} onChange={handleFormChange} />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control name="adress_neighborhood" type="text" required value={form.adress_neighborhood} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control name="adress_city" type="text" required value={form.adress_city} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="adress_state" required value={form.adress_state} onChange={handleFormChange}>
                <option value="">Selecione o estado</option>
                <option value="AC">Acre - AC</option>
                <option value="AL">Alagoas - AL</option>
                <option value="AP">Amapá - AP</option>
                <option value="AM">Amazonas - AM</option>
                <option value="BA">Bahia - BA</option>
                <option value="CE">Ceará - CE</option>
                <option value="DF">Distrito Federal - DF</option>
                <option value="ES">Espírito Santo - ES</option>
                <option value="GO">Goiás - GO</option>
                <option value="MA">Maranhão - MA</option>
                <option value="MT">Mato Grosso - MT</option>
                <option value="MS">Mato Grosso do Sul - MS</option>
                <option value="MG">Minas Gerais - MG</option>
                <option value="PA">Pará - PA</option>
                <option value="PB">Paraíba - PB</option>
                <option value="PR">Paraná - PR</option>
                <option value="PE">Pernambuco - PE</option>
                <option value="PI">Piauí - PI</option>
                <option value="RJ">Rio de Janeiro - RJ</option>
                <option value="RN">Rio Grande do Norte - RN</option>
                <option value="RS">Rio Grande do Sul - RS</option>
                <option value="RO">Rondônia - RO</option>
                <option value="RR">Roraima - RR</option>
                <option value="SC">Santa Catarina - SC</option>
                <option value="SP">São Paulo - SP</option>
                <option value="SE">Sergipe - SE</option>
                <option value="TO">Tocantins - TO</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Modal (form) para detalhes */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany && (
            <div>
              <p><strong>Nome:</strong> {selectedCompany.name}</p>
              <p><strong>Email:</strong> {selectedCompany.email}</p>
              <p><strong>CEP:</strong> {selectedCompany.zip_code}</p>
              <p><strong>Rua:</strong> {selectedCompany.adress_street}</p>
              <p><strong>Número:</strong> {selectedCompany.adress_number}</p>
              <p><strong>Complemento:</strong> {selectedCompany.adress_complement}</p>
              <p><strong>Bairro:</strong> {selectedCompany.adress_neighborhood}</p>
              <p><strong>Cidade:</strong> {selectedCompany.adress_city}</p>
              <p><strong>Estado:</strong> {selectedCompany.adress_state}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal (form) para editar */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Empresa</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="name" type="text" required value={editForm.name || ''} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" required value={editForm.email || ''} onChange={handleEditChange} />
            </Form.Group>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>CEP</Form.Label>
                <Form.Control name="zip_code" type="text" required value={editForm.zip_code || ''} onChange={handleEditChange} placeholder="12345-678" />
              </Form.Group>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>Complemento</Form.Label>
                <Form.Control name="adress_complement" type="text" value={editForm.adress_complement || ''} onChange={handleEditChange} />
              </Form.Group>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Group className="mb-3" style={{ flex: 2 }}>
                <Form.Label>Rua</Form.Label>
                <Form.Control name="adress_street" type="text" required value={editForm.adress_street || ''} onChange={handleEditChange} />
              </Form.Group>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label>Número</Form.Label>
                <Form.Control name="adress_number" type="text" required value={editForm.adress_number || ''} onChange={handleEditChange} />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control name="adress_neighborhood" type="text" required value={editForm.adress_neighborhood || ''} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control name="adress_city" type="text" required value={editForm.adress_city || ''} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="adress_state" required value={editForm.adress_state || ''} onChange={handleEditChange}>
                <option value="">Selecione o estado</option>
                <option value="AC">Acre - AC</option>
                <option value="AL">Alagoas - AL</option>
                <option value="AP">Amapá - AP</option>
                <option value="AM">Amazonas - AM</option>
                <option value="BA">Bahia - BA</option>
                <option value="CE">Ceará - CE</option>
                <option value="DF">Distrito Federal - DF</option>
                <option value="ES">Espírito Santo - ES</option>
                <option value="GO">Goiás - GO</option>
                <option value="MA">Maranhão - MA</option>
                <option value="MT">Mato Grosso - MT</option>
                <option value="MS">Mato Grosso do Sul - MS</option>
                <option value="MG">Minas Gerais - MG</option>
                <option value="PA">Pará - PA</option>
                <option value="PB">Paraíba - PB</option>
                <option value="PR">Paraná - PR</option>
                <option value="PE">Pernambuco - PE</option>
                <option value="PI">Piauí - PI</option>
                <option value="RJ">Rio de Janeiro - RJ</option>
                <option value="RN">Rio Grande do Norte - RN</option>
                <option value="RS">Rio Grande do Sul - RS</option>
                <option value="RO">Rondônia - RO</option>
                <option value="RR">Roraima - RR</option>
                <option value="SC">Santa Catarina - SC</option>
                <option value="SP">São Paulo - SP</option>
                <option value="SE">Sergipe - SE</option>
                <option value="TO">Tocantins - TO</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Modal para excluir */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir esta empresa?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CompanySelection; 