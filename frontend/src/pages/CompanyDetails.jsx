import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); //(sistema de access do l2)
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!selectedCompanyId) {
      navigate('/company-selection');
      return;
    }
  }, [navigate]);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Empresa {id}</h2>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Voltar ao Dashboard
        </button>
      </div>
      <button onClick={() => navigate(`/companies/${id}/places`)} style={{ marginRight: 10 }}>
        Locais
      </button>
      <button onClick={() => navigate(`/companies/${id}/patients`)} style={{ marginRight: 10 }}>
        Pacientes
      </button>
      <button onClick={() => navigate(`/companies/${id}/users`)}>
        Usuários
      </button>
    </div>
  );
}

export default CompanyDetails; 