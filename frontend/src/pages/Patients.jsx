import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Pagination, Modal, Button, Alert } from 'react-bootstrap';
import { contemTexto, formatarCPF } from '../utils/stringUtils';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // todos os pacientes
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 2; // 2 por página conforme camus
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // estado modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    company_id: ''
  });
  const [companies, setCompanies] = useState([]);

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
    axios.get(`/api/patients?company_id=${selectedCompanyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.error) setError(res.data.error);
        else {
          const pacientes = Array.isArray(res.data) ? res.data : [];
          setAllPatients(pacientes);
          setPatients(pacientes);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao buscar pacientes');
        setLoading(false);
      });
  }, [navigate]);

  // filtrar pacientes localmente (sem reload)
  useEffect(() => {
    if (allPatients.length > 0) {
      const filtrados = allPatients.filter(patient => {
        if (filters.search === '') return true;
        
        const matchName = contemTexto(patient.name, filters.search);
        const matchCPF = contemTexto(patient.cpf || '', filters.search);
        return matchName || matchCPF;
      });
      setPatients(filtrados);
      setCurrentPage(1); // volta para primeira página ao filtrar (uma espécie de reiniciada na tabela)
    }
  }, [filters, allPatients]);

  // calcula pacientes para exibir na página atual (pacientes por pag)
  const patientsParaExibir = patients.slice(
    (currentPage - 1) * patientsPerPage, 
    currentPage * patientsPerPage
  );

  const proximaPagina = () => {
    if (currentPage < Math.ceil(patients.length / patientsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const irParaPagina = (pagina) => {
    if (pagina > 0 && pagina <= Math.ceil(patients.length / patientsPerPage)) {
      setCurrentPage(pagina);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchAllPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      
      const res = await axios.get(`/api/patients?company_id=${selectedCompanyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        const pacientes = Array.isArray(res.data) ? res.data : [];
        setAllPatients(pacientes);
        setPatients(pacientes);
      }
    } catch (err) {
      setError('Erro ao buscar pacientes');
    }
  };

  // buscar clínicas ao abrir o modal (já deixa preenchido)
  useEffect(() => {
    if (showCreateModal || showEditModal) {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('/api/companies', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
            setCompanies(sorted);
          });
      }
    }
  }, [showCreateModal, showEditModal]);

  const handleShowCreate = () => {
    setFormData({
      name: '',
      cpf: '',
      birth_date: '',
      company_id: ''
    });
    setShowCreateModal(true);
  };

  const handleShowEdit = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/patients/${patientId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // formatar a data para o formato YYYY-MM-DD (requerido pelo input type="date")
      const patientData = { ...res.data };
      if (patientData.birth_date) {
        // usar apenas a data sem considerar timezone
        const date = new Date(patientData.birth_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        patientData.birth_date = `${year}-${month}-${day}`;
      }
      
      setFormData(patientData);
      setShowEditModal(true);
    } catch (err) {
      setError('Erro ao buscar paciente para edição.');
    }
  };

  const handleShowDelete = (patientId) => {
    setDeletePatientId(patientId);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const selectedCompanyId = localStorage.getItem('selectedCompanyId');
      const isEditing = showEditModal;
      const url = isEditing ? `/api/patients/${formData.id}` : '/api/patients';
      const method = isEditing ? 'put' : 'post';
      
      // garantir que o company_id está sendo enviado mesmo que não apareça em tela
      const dataToSend = {
        ...formData,
        company_id: formData.company_id || selectedCompanyId
      };
      
      await axios[method](url, dataToSend, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setShowCreateModal(false);
      setShowEditModal(false);
      fetchAllPatients();
    } catch (err) {
      setError('Erro ao salvar paciente.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/patients/${deletePatientId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setShowDeleteModal(false);
      setDeletePatientId(null);
      fetchAllPatients();
    } catch (err) {
      setError('Erro ao deletar paciente.');
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (loading) return <div>Carregando pacientes...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Pacientes</h2>
        <div>
          <Button variant="success" className="me-2" onClick={() => setShowCreateModal(true)}>
            Novo Paciente
          </Button>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* busca tanto por nome quanto cpf */}
      <div style={{ marginBottom: 20 }}>
        <Form.Control
          name="search"
          placeholder="Buscar por nome ou CPF..."
          value={filters.search}
          onChange={handleFilterChange}
          style={{ maxWidth: 400 }}
        />
      </div>

      {patientsParaExibir.length === 0 ? (
        <p>Nenhum paciente encontrado</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data de Nascimento</th>
                
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {patientsParaExibir.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.cpf ? formatarCPF(p.cpf) : '-'}</td>
                  <td>{p.birth_date ? new Date(p.birth_date).toLocaleDateString('pt-BR') : '-'}</td>
                  
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button 
                        style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #007bff', background: '#007bff', color: 'white', cursor: 'pointer' }}
                        onClick={() => navigate(`/patients/${p.id}`)}
                      >
                        Ver detalhes
                      </button>
                      <Button variant="warning" size="sm" onClick={() => handleShowEdit(p.id)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleShowDelete(p.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* paginação */}
          {Math.ceil(patients.length / patientsPerPage) > 1 && (
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
                
                {Array.from({ length: Math.ceil(patients.length / patientsPerPage) }, (_, i) => i + 1).map(page => (
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
                  disabled={currentPage === Math.ceil(patients.length / patientsPerPage)}
                />
                <Pagination.Last 
                  onClick={() => irParaPagina(Math.ceil(patients.length / patientsPerPage))} 
                  disabled={currentPage === Math.ceil(patients.length / patientsPerPage)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal (form) para criar e editar */}
      <Modal show={showCreateModal || showEditModal} onHide={() => { setShowCreateModal(false); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{showEditModal ? 'Editar Paciente' : 'Novo Paciente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                name="name" 
                type="text" 
                required 
                value={formData.name || ''} 
                onChange={handleFormChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control 
                name="cpf" 
                type="text" 
                value={formData.cpf || ''} 
                onChange={handleFormChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control 
                name="birth_date" 
                type="date" 
                required 
                value={formData.birth_date || ''} 
                onChange={handleFormChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Clínica</Form.Label>
              <Form.Select 
                name="company_id" 
                required 
                value={formData.company_id || ''} 
                onChange={handleFormChange}
              >
                <option value="">Selecione a clínica</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal (form) excluir */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este paciente?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Patients; 