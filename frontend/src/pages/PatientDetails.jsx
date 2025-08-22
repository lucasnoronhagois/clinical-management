import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get(`/api/patients/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.error) setError(res.data.error);
        else setPatient(res.data);
      })
      .catch(() => setError('Erro ao buscar detalhes do paciente'));
  }, [id, navigate]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!patient) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Detalhes do Paciente</h2>
        <button 
          onClick={() => navigate('/patients')} 
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Voltar à Lista
        </button>
      </div>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 20 }}>
        <p><strong>Código do paciente:</strong> {patient.id}</p>
        <p><strong>Nome:</strong> {patient.name}</p>
        <p><strong>CPF:</strong> {patient.cpf || 'N/A'}</p>
        <p><strong>Data de Nascimento:</strong> {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : 'N/A'}</p>
        <p><strong>Empresa:</strong> {patient.company?.name || 'N/A'}</p>
        <p><strong>Criado em:</strong> {patient.created_at ? new Date(patient.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
      </div>
    </div>
  );
}

export default PatientDetails; 