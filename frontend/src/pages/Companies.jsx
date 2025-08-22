import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Companies() {
  const [companies, setCompanies] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    axios.get('/api/companies', {
      headers: { 'Authorization': `Bearer ${token}` } //(sistema de access do l2)
    })
      .then(res => {
        if (res.data.error) setError(res.data.error);
        else setCompanies(res.data);
      })
      .catch(() => setError('Erro ao buscar empresas'));
  }, [navigate]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!companies) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Empresas</h2>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Voltar ao Dashboard
        </button>
      </div>
      {companies.length === 0 ? (
        <p>Nenhuma empresa encontrada</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {companies.map(c => (
            <button key={c.id} onClick={() => navigate(`/companies/${c.id}`)} style={{ minWidth: 120 }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies; 