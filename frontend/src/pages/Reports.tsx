import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Table, Badge, Form, Button, Row, Col } from 'react-bootstrap';
import { contemTexto } from '../utils/stringUtils';

interface AttendanceReport {
  id: number;
  name: string;
  total_attendances: number;
  total_patients: number;
  role: string;
}

interface Filters {
  search: string;
  role: string;
}

function Reports(): React.ReactElement {
  const navigate = useNavigate();
  const [attendancesReport, setAttendancesReport] = useState<AttendanceReport[]>([]);
  const [allAttendancesReport, setAllAttendancesReport] = useState<AttendanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    role: 'DOCTOR'
  });

  const token = localStorage.getItem('token');
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  // se é adm
  const getIsRoot = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload.root;
      }
    } catch (e) {}
    return false;
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedCompanyId) {
      navigate('/company-selection');
      return;
    }
    
    // se é adm
    if (!getIsRoot()) {
      navigate('/dashboard');
      return;
    }
    
    fetchAttendancesReport();
  }, [navigate, token, selectedCompanyId, filters.role]);

  // filtrar dados localmente por nome (sem reload)
  useEffect(() => {
    if (allAttendancesReport.length > 0) {
      const filtrados = allAttendancesReport.filter(item => {
        if (filters.search === '') return true;
        return contemTexto(item.name, filters.search);
      });
      setAttendancesReport(filtrados);
    }
  }, [filters.search, allAttendancesReport]);

  const fetchAttendancesReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('company_id', selectedCompanyId || '');
      
      if (filters.role) {
        params.append('role', filters.role);
      }

      const res = await axios.get(`/api/reports/attendances?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = res.data || [];
      setAllAttendancesReport(data);
      setAttendancesReport(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar relatório de atendimentos');
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = (): void => {
    setFilters({
      search: '',
      role: 'DOCTOR'
    });
  };

  const getRoleLabel = (role: string): string => {
    return role === 'DOCTOR' ? 'Médico' : role === 'RECEPTIONIST' ? 'Recepcionista' : role;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 20 }}>Carregando relatórios...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Relatórios</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
          Voltar ao Dashboard
        </button>
      </div>

      {/* Relatório de atendimentos (tanto médico quanto recep) */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Atendimentos por Profissional</h5>
        </Card.Header>
        <Card.Body>
          {/* filtros */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Buscar por nome</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Digite o nome do profissional..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrar por função</Form.Label>
                <Form.Select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os profissionais</option>
                  <option value="DOCTOR">Médicos</option>
                  <option value="RECEPTIONIST">Recepcionistas</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="secondary" onClick={clearFilters}>
                Limpar
              </Button>
            </Col>
          </Row>
          {attendancesReport.length === 0 ? (
            <p className="text-muted">Nenhum atendimento encontrado para esta empresa.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Profissional</th>
                  <th>Função</th>
                  <th>Total de Atendimentos</th>
                  <th>Posição</th>
                </tr>
              </thead>
              <tbody>
                {attendancesReport.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <Badge bg={item.role === 'DOCTOR' ? 'primary' : 'info'}>
                        {getRoleLabel(item.role)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="success" style={{ fontSize: '1em' }}>
                        {item.total_attendances}
                      </Badge>
                    </td>
                    <td>
                      {index === 0 && <Badge bg="warning" text="dark">🥇 1º Lugar</Badge>}
                      {index === 1 && <Badge bg="secondary">🥈 2º Lugar</Badge>}
                      {index === 2 && <Badge bg="info">🥉 3º Lugar</Badge>}
                      {index > 2 && <span className="text-muted">{index + 1}º lugar</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* resumo das estatísticas */}
      {attendancesReport.length > 0 && (
        <Card>
          <Card.Header>
            <h5>Resumo</h5>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <h4>{attendancesReport.length}</h4>
                <small className="text-muted">Profissionais</small>
              </div>
              <div>
                <h4>{attendancesReport.reduce((sum, item) => sum + item.total_attendances, 0)}</h4>
                <small className="text-muted">Total de Atendimentos</small>
              </div>
              <div>
                <h4>{Math.round(attendancesReport.reduce((sum, item) => sum + item.total_attendances, 0) / attendancesReport.length)}</h4>
                <small className="text-muted">Média por Profissional</small>
              </div>
              <div>
                <h4>{attendancesReport[0]?.total_attendances || 0}</h4>
                <small className="text-muted">Maior número de um único profissional</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Reports; 