import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function Dashboard() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState(null);
  const [filteredStatistics, setFilteredStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  const token = localStorage.getItem('token');
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedCompanyId) {
      navigate('/company-selection');
      return;
    }
    fetchStatistics();
  }, [navigate, token, selectedCompanyId]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('company_id', selectedCompanyId);
      // dados dos últimos 365 dias para ter um range completo
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      params.append('start_date', oneYearAgo.toISOString().split('T')[0]);
      params.append('end_date', new Date().toISOString().split('T')[0]);

      const res = await axios.get(`/api/dashboard/statistics?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAllData(res.data);
      setLoading(false);    
    } catch (err) {
      showFlashMessage('Erro ao carregar estatísticas');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allData && allData.details && !filteredStatistics) {
      applyQuickFilter('month');
    }
  }, [allData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    // limpar filtro rápido ativo quando usuário edita manualmente
    setActiveQuickFilter('');
    
    // aplicar filtro em tempo real se ambas as datas estão preenchidas
    const newDateRange = { ...dateRange, [name]: value };
    if (newDateRange.start_date && newDateRange.end_date) {
      filterDataByDateRange(newDateRange.start_date, newDateRange.end_date);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // proibe que data final seja anterior à inicial
    if (dateRange.start_date && dateRange.end_date && dateRange.end_date < dateRange.start_date) {
      showFlashMessage('A data final não pode ser anterior à data inicial');
      setDateRange({ start_date: '', end_date: '' }); // reset dos campos
      return;
    }
    
    // aplicar filtro local (evitar o reload)
    filterDataByDateRange(dateRange.start_date, dateRange.end_date);
  };

  // funções para filtros rápidos
  const applyQuickFilter = (filterType) => {
    let dates;
    
    switch (filterType) {
      case 'today':
        dates = getTodayDates();
        break;
      case 'week':
        dates = getThisWeekDates();
        break;
      case 'month':
        dates = getThisMonthDates();
        break;
      default:
        return;
    }
    
    setDateRange(dates);
    setActiveQuickFilter(filterType);
    // aplicar filtro local imediatamente para já puxar na tela
    filterDataByDateRange(dates.start_date, dates.end_date);
  };

  const getPeriodLabel = () => {
    if (!filteredStatistics || !filteredStatistics.period) return '';
    const start = new Date(filteredStatistics.period.start_date);
    const end = new Date(filteredStatistics.period.end_date);

    // se o período cobre exatamente um mês
    const isFullMonth =
      start.getDate() === 1 &&
      end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() &&
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    if (isFullMonth) {
      const mes = start.toLocaleString('pt-BR', { month: 'long' });
      return `${mes.charAt(0).toUpperCase() + mes.slice(1)}/${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('pt-BR')} a ${end.toLocaleDateString('pt-BR')}`;
  };

  // função para filtrar dados localmente
  const filterDataByDateRange = (startDate, endDate) => {
    if (!allData || !allData.details) return;

    const start = startDate ? new Date(startDate + 'T00:00:00') : null;
    const end = endDate ? new Date(endDate + 'T23:59:59') : null;

    // filtrar atendimentos
    const filteredAttendances = allData.details.attendances_by_day ? 
      Object.entries(allData.details.attendances_by_day)
        .filter(([date]) => {
          const attendanceDate = new Date(date + 'T12:00:00'); // meio-dia para comparação
          return (!start || attendanceDate >= start) && (!end || attendanceDate <= end);
        })
        .reduce((acc, [date, count]) => {
          acc[date] = count;
          return acc;
        }, {}) : {};

    // filtrar pacientes
    const filteredPatients = allData.details.patients_by_day ?
      Object.entries(allData.details.patients_by_day)
        .filter(([date]) => {
          const patientDate = new Date(date + 'T12:00:00'); // meio-dia para comparação
          return (!start || patientDate >= start) && (!end || patientDate <= end);
        })
        .reduce((acc, [date, count]) => {
          acc[date] = count;
          return acc;
        }, {}) : {};

    // totais
    const totalAttendances = Object.values(filteredAttendances).reduce((sum, count) => sum + count, 0);
    const totalPatients = Object.values(filteredPatients).reduce((sum, count) => sum + count, 0);

    // período do filtro usando as datas fornecidas
    // Se não há datas, usar um período que inclui todos os dados
    let filterStartDate, filterEndDate;
    if (startDate && endDate) {
      filterStartDate = new Date(startDate + 'T00:00:00');
      filterEndDate = new Date(endDate + 'T23:59:59');
    } else {
      // Se não há datas, usar um período amplo que inclui todos os dados
      const allDates = [
        ...Object.keys(allData.details.attendances_by_day || {}),
        ...Object.keys(allData.details.patients_by_day || {})
      ];
      
      if (allDates.length > 0) {
        const sortedDates = allDates.sort();
        filterStartDate = new Date(sortedDates[0] + 'T00:00:00');
        filterEndDate = new Date(sortedDates[sortedDates.length - 1] + 'T23:59:59');
      } else {
        // Se não há dados, usar a data atual
        filterStartDate = new Date();
        filterEndDate = new Date();
      }
    }

    setFilteredStatistics({
      period: {
        start_date: filterStartDate.toISOString(),
        end_date: filterEndDate.toISOString()
      },
      statistics: {
        total_attendances: totalAttendances,
        total_patients: totalPatients
      },
      details: {
        attendances_by_day: filteredAttendances,
        patients_by_day: filteredPatients
      }
    });
  };

  const showFlashMessage = (message, type = 'error') => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage('');
    }, 5000); // Desaparece após 5 seg
  };

  // funções calcular datas
  const getTodayDates = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    return {
      start_date: todayString,
      end_date: todayString
    };
  };

  const getThisWeekDates = () => {
    const today = new Date();
    
    // data local para evitar problemas de timezone
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    
    // getDay() retorna: o dia da semana seguindo a logica do array (0,1,2,etc)
    const dayOfWeek = today.getDay(); // 0-6
    
    // quantos dias voltar para chegar no domingo
    const daysToSubtract = dayOfWeek;
    
    // data do início da semana (domingo)
    const startOfWeek = new Date(year, month, date - daysToSubtract);
    
    // data do fim da semana (sábado)
    const endOfWeek = new Date(year, month, date - daysToSubtract + 6);
 
    return {
      start_date: startOfWeek.toISOString().split('T')[0],
      end_date: endOfWeek.toISOString().split('T')[0]
    };
  };

  const getThisMonthDates = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      start_date: startOfMonth.toISOString().split('T')[0],
      end_date: endOfMonth.toISOString().split('T')[0]
    };
  };



  const handleChangeCompany = () => {
    localStorage.removeItem('selectedCompanyId');
    navigate('/company-selection');
  };

  // token para saber se é adm
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
  const isRoot = getIsRoot();



  if (loading) return <div style={{ textAlign: 'center', marginTop: 20 }}>Carregando estatísticas...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }} className="dashboard-container">
      {/* Flash Message */}
      {flashMessage && (
        <div 
          className={`alert alert-${flashMessage.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} 
          role="alert"
          style={{
            position: 'fixed',
            top: '80px', // Abaixo da navbar
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
        <h2>Dashboard</h2>
        {isRoot && (
          <button onClick={handleChangeCompany} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Trocar Empresa
          </button>
        )}
      </div>

      {/* filtro de período */}
      <Card className="mb-4 dashboard-card">
        <Card.Body>
          <h5>Filtrar por Período</h5>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Inicial</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={dateRange.start_date}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Final</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={dateRange.end_date}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="me-2">
                  Filtrar
                </Button>
                <Button variant="secondary" onClick={() => {
                  setDateRange({ start_date: '', end_date: '' });
                  setActiveQuickFilter('');
                  // Reset para todos os dados sem filtro de data
                  if (allData) {
                    filterDataByDateRange('', '');
                  }
                }}>
                  Limpar
                </Button>
              </Col>
              <Col md={3}>
                <Form.Label>Filtros Rápidos</Form.Label>
                <div className="d-flex flex-column gap-1">
                  <Button 
                    variant={activeQuickFilter === 'today' ? 'success' : 'outline-success'} 
                    size="sm"
                    onClick={() => applyQuickFilter('today')}
                  >
                    📅 Hoje
                  </Button>
                  <Button 
                    variant={activeQuickFilter === 'week' ? 'info' : 'outline-info'} 
                    size="sm"
                    onClick={() => applyQuickFilter('week')}
                  >
                    📊 Esta Semana
                  </Button>
                  <Button 
                    variant={activeQuickFilter === 'month' ? 'warning' : 'outline-warning'} 
                    size="sm"
                    onClick={() => applyQuickFilter('month')}
                  >
                    📈 Este Mês
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* estatísticas */}
      {filteredStatistics && (
        <Row className="mb-4">
          <Col md={6}>
            <Card className="text-center dashboard-card">
              <Card.Body>
                <Card.Title>Total de Atendimentos</Card.Title>
                <h2 style={{ color: '#007bff' }}>{filteredStatistics.statistics?.total_attendances || 0}</h2>
                <small className="text-muted">Período: {getPeriodLabel()}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="text-center dashboard-card">
              <Card.Body>
                <Card.Title>Novos Pacientes</Card.Title>
                <h2 style={{ color: '#28a745' }}>{filteredStatistics.statistics?.total_patients || 0}</h2>
                <small className="text-muted">Período: {getPeriodLabel()}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* navegação para outras pags */}
      <Card className="dashboard-card">
        <Card.Body>
          <h5>Gerenciamento</h5>
          <p>Selecione uma opção para gerenciar:</p>
          <div>
            <Button variant="outline-primary" onClick={() => navigate('/attendances')} className="me-2 mb-2">
              Atendimentos
            </Button>
            <Button variant="outline-success" onClick={() => navigate('/patients')} className="me-2 mb-2">
              Pacientes
            </Button>
            <Button variant="outline-info" onClick={() => navigate('/places')} className="me-2 mb-2">
              Locais
            </Button>
            {isRoot && (
              <Button variant="outline-secondary" onClick={() => navigate('/reports')} className="me-2 mb-2">
                Relatórios
              </Button>
            )}
            {isRoot && (
              <Button variant="outline-warning" onClick={() => navigate('/users')} className="me-2 mb-2">
                Usuários
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard; 