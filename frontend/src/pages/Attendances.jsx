import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Pagination, Modal, Button, Alert } from 'react-bootstrap';
import { contemTexto } from '../utils/stringUtils';

function Attendances() {
  const [attendances, setAttendances] = useState([]);
  const [allAttendances, setAllAttendances] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const attendancesPerPage = 2;
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // estados para modais (formulário bonitinho)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAttendanceId, setDeleteAttendanceId] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    patient_id: '',
    place_id: '',
    user_id: '',
    company_id: ''
  });

  // estados para dados dos selects
  const [patients, setPatients] = useState([]);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('token');
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  // role do usuário do token (sistema de access do l2)
  const getUserRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload.role;
      }
    } catch (e) { }
    return null;
  };

  // dados do usuário logado do token (sistema de access do l2)
  const getLoggedUser = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: tokenPayload.id,
          name: tokenPayload.name,
          role: tokenPayload.role,
          root: tokenPayload.root
        };
      }
    } catch (e) { }
    return null;
  };

  const userRole = getUserRole();
  const loggedUser = getLoggedUser();

  const showFlashMessage = (message, type = 'success') => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage('');
    }, 5000); // flash sumir em 5seg
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllAttendances();
  }, [token, navigate]);

  const fetchAllAttendances = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('company_id', selectedCompanyId);

      const res = await axios.get(`/api/attendances?${params}`, {
        headers: { Authorization: `Bearer ${token}` } //chama o token pra conceder acesso
      });

      const atendimentos = Array.isArray(res.data) ? res.data : [];
      setAllAttendances(atendimentos);
      setAttendances(atendimentos);
      setLoading(false);
    } catch (err) {
      showFlashMessage('Erro ao carregar atendimentos', 'error');
      setLoading(false);
    }
  };

  // filtro de atendimentos localmente (pra não recarregar a pag toda vez)
  useEffect(() => {
    if (allAttendances.length > 0) {
      const filtrados = allAttendances.filter(attendance => {
        if (filters.search === '') return true;

        const matchPatient = contemTexto(attendance.patient?.name || '', filters.search);
        const matchUser = contemTexto(attendance.user?.name || '', filters.search);
        const matchPlace = contemTexto(attendance.place?.name || '', filters.search);

        return matchPatient || matchUser || matchPlace;
      });
      setAttendances(filtrados);
      setCurrentPage(1);
    }
  }, [filters, allAttendances]);

  // calcular atendimentos para exibir na página atual
  const attendancesParaExibir = attendances.slice(
    (currentPage - 1) * attendancesPerPage,
    currentPage * attendancesPerPage
  );

  const proximaPagina = () => {
    if (currentPage < Math.ceil(attendances.length / attendancesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const irParaPagina = (pagina) => {
    if (pagina > 0 && pagina <= Math.ceil(attendances.length / attendancesPerPage)) {
      setCurrentPage(pagina);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // já usar alguns dados para os selects ao abrir o modal (formulário bonitinho)
  useEffect(() => {
    if (showCreateModal || showEditModal) {
      const token = localStorage.getItem('token');
      const companyId = localStorage.getItem('selectedCompanyId');
      if (token && companyId) {
        axios.get(`/api/patients?company_id=${companyId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
            setPatients(sorted);
          });
        axios.get(`/api/places?company_id=${companyId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const sorted = (res.data || []).sort((a, b) => a.name.localeCompare(b.name));
            setPlaces(sorted);
          });
        axios.get(`/api/users?company_id=${companyId}&limit=1000`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            // Filtrar apenas DOCTOR
            const doctors = (res.data.users || []).filter(u => u.role === 'DOCTOR');
            const sorted = doctors.sort((a, b) => a.name.localeCompare(b.name));
            setUsers(sorted);
          });
      }
    }
  }, [showCreateModal, showEditModal]);

  const handleShowCreate = () => {
    setFormData({
      start_date: '',
      patient_id: '',
      place_id: '',
      user_id: '',
      company_id: selectedCompanyId
    });
    setShowCreateModal(true);
  };

  const handleShowEdit = async (attendanceId) => {
    try {
      const res = await axios.get(`/api/attendances/${attendanceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // formatar a data para o formato YYYY-MM-DDTHH:MM (garantir o input datetime-local)
      const attendanceData = { ...res.data };
      if (attendanceData.start_date) {
        const date = new Date(attendanceData.start_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        attendanceData.start_date = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      setFormData(attendanceData);
      setShowEditModal(true);
    } catch (err) {
      setError('Erro ao buscar atendimento para edição.');
    }
  };

  const handleShowDelete = (attendanceId) => {
    setDeleteAttendanceId(attendanceId);
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
      const isEditing = showEditModal;
      const url = isEditing ? `/api/attendances/${formData.id}` : '/api/attendances';
      const method = isEditing ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` } //(sistema de access do l2)
      });

      setShowCreateModal(false);
      setShowEditModal(false);
      fetchAllAttendances();
      showFlashMessage('Atendimento salvo com sucesso!', 'success');
    } catch (err) {
      showFlashMessage('Erro ao salvar atendimento.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/attendances/${deleteAttendanceId}`, {
        headers: { Authorization: `Bearer ${token}` } // (sistema de access do l2)
      });
      setShowDeleteModal(false);
      setDeleteAttendanceId(null);
      fetchAllAttendances();
      showFlashMessage('Atendimento excluído com sucesso!', 'success');
    } catch (err) {
      showFlashMessage('Erro ao excluir atendimento.', 'error');
    }
  };

  const handleFinishAttendance = async (attendanceId) => { //deixei exclusivo para doctor
    try {
      await axios.put(`/api/attendances/${attendanceId}/finish`, {}, {
        headers: { Authorization: `Bearer ${token}` } //(sistema de access do l2)
      });
      fetchAllAttendances(); // Recarregar lista
      showFlashMessage('Atendimento finalizado com sucesso!', 'success');
    } catch (err) {
      if (err.response?.status === 400) {
        showFlashMessage(err.response.data.error, 'error');
      } else {
        showFlashMessage('Erro ao finalizar atendimento', 'error');
      }
    }
  };

  const handleStartConsultation = async (attendanceId) => { // deixei exclusivo para doctor
    try {
      const response = await axios.put(`/api/attendances/${attendanceId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` } //(sistema de access do l2)
      });

      // atualizar apenas o atendimento específico na lista
      const currentTime = new Date();
      setAllAttendances(prevAttendances =>
        prevAttendances.map(attendance =>
          attendance.id === attendanceId
            ? { ...attendance, confirmed_at: currentTime.toISOString() }
            : attendance
        )
      );

      showFlashMessage('Consulta iniciada com sucesso!', 'success');
    } catch (err) {
      if (err.response?.status === 400) {
        showFlashMessage(err.response.data.error, 'error');
      } else {
        showFlashMessage('Erro ao iniciar consulta', 'error');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      {flashMessage && (
        <div
          className={`alert alert-${flashMessage.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}
          role="alert"
          style={{
            position: 'fixed',
            top: '80px', // garantir abaixo da navbar
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            minWidth: '300px',
            maxWidth: '600px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px'
          }}
        >
          {flashMessage.message}
          <button type="button" className="btn-close" onClick={() => setFlashMessage('')}></button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Atendimentos</h2>
        <div>
          <Button variant="primary" className="me-2" onClick={handleShowCreate}>
            Novo Atendimento
          </Button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* realizar a busca */}
      <div style={{ marginBottom: 20 }}>
        <Form.Control
          name="search"
          placeholder="Buscar por paciente, profissional ou local..."
          value={filters.search}
          onChange={handleFilterChange}
          style={{ maxWidth: 400 }}
        />
      </div>

      {attendancesParaExibir.length === 0 ? (
        <p>Nenhum atendimento encontrado</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Profissional</th>
                <th>Local</th>
                <th>Data de Início</th>
                <th>Data da Consulta</th>
                <th>Data de Fim</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {attendancesParaExibir.map(a => (
                <tr key={a.id}>
                  <td>{a.patient?.name || 'N/A'}</td>
                  <td>{a.user?.name || 'N/A'}</td>
                  <td>{a.place?.name || 'N/A'}</td>
                  <td>{a.start_date ? new Date(a.start_date).toLocaleString('pt-BR') : 'N/A'}</td>
                  <td>
                    {a.confirmed_at ? (
                      new Date(a.confirmed_at).toLocaleString('pt-BR')
                    ) : (
                      userRole === 'DOCTOR' && loggedUser?.id === a.user_id && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartConsultation(a.id)}
                        >
                          Iniciar
                        </Button>
                      )
                    )}
                  </td>
                  <td>{a.end_date ? new Date(a.end_date).toLocaleString('pt-BR') : 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {!a.end_date && userRole === 'DOCTOR' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleFinishAttendance(a.id)}
                        >
                          Finalizar
                        </Button>
                      )}
                      <Button variant="warning" size="sm" onClick={() => handleShowEdit(a.id)}>
                        Editar
                      </Button>
                      {loggedUser?.root && (
                        <Button variant="danger" size="sm" onClick={() => handleShowDelete(a.id)}>
                          Excluir
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          {Math.ceil(attendances.length / attendancesPerPage) > 1 && (
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

                {Array.from({ length: Math.ceil(attendances.length / attendancesPerPage) }, (_, i) => i + 1).map(page => (
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
                  disabled={currentPage === Math.ceil(attendances.length / attendancesPerPage)}
                />
                <Pagination.Last
                  onClick={() => irParaPagina(Math.ceil(attendances.length / attendancesPerPage))}
                  disabled={currentPage === Math.ceil(attendances.length / attendancesPerPage)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal (form bonit) Criar/Editar */}
      <Modal show={showCreateModal || showEditModal} onHide={() => { setShowCreateModal(false); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{showEditModal ? 'Editar Atendimento' : 'Novo Atendimento'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Data e hora de início</Form.Label>
              <Form.Control
                name="start_date"
                type="datetime-local"
                required
                value={formData.start_date || ''}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Paciente</Form.Label>
              <Form.Select
                name="patient_id"
                required
                value={formData.patient_id || ''}
                onChange={handleFormChange}
              >
                <option value="">Selecione o paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Local</Form.Label>
              <Form.Select
                name="place_id"
                required
                value={formData.place_id || ''}
                onChange={handleFormChange}
              >
                <option value="">Selecione o local</option>
                {places.map(pl => (
                  <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profissional</Form.Label>
              <Form.Select
                name="user_id"
                required
                value={formData.user_id || ''}
                onChange={handleFormChange}
              >
                <option value="">Selecione o profissional</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>Dr(a) {u.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ opacity: 0.6, fontSize: '0.9em' }}>
                {loggedUser && `Logado como: ${loggedUser.name}`}
              </div>
              <div>
                <Button variant="secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" className="ms-2">Salvar</Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal (form bonito) Excluir */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Atendimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este atendimento?
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

export default Attendances; 