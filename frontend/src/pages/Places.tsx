import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Pagination, Modal, Button, Alert, Table, Card, Row, Col } from 'react-bootstrap';
import { contemTexto } from '../utils/stringUtils';

interface Place {
  id: number;
  name: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  company_id: string;
}

interface Filters {
  search: string;
}

function Places(): React.ReactElement {
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [filters, setFilters] = useState<Filters>({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 10;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // estados modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [deletePlaceId, setDeletePlaceId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company_id: ''
  });

  const token = localStorage.getItem('token');
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllPlaces();
  }, [token, navigate]);

  const fetchAllPlaces = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('company_id', selectedCompanyId || '');

      const res = await axios.get(`/api/places?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const lugares = Array.isArray(res.data) ? res.data : [];
      setAllPlaces(lugares);
      setPlaces(lugares);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar locais');
      setLoading(false);
    }
  };

  // filtrar locais localmente (sem o reload)
  useEffect(() => {
    if (allPlaces.length > 0) {
      const filtrados = allPlaces.filter(place => {
        if (filters.search === '') return true;
        return contemTexto(place.name, filters.search);
      });
      setPlaces(filtrados);
      setCurrentPage(1);
    }
  }, [filters, allPlaces]);

  // calcular locais para exibir na página atual (places por pag)
  const placesParaExibir = places.slice(
    (currentPage - 1) * placesPerPage, 
    currentPage * placesPerPage
  );

  const proximaPagina = () => {
    if (currentPage < Math.ceil(places.length / placesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const irParaPagina = (pagina: number): void => {
    if (pagina > 0 && pagina <= Math.ceil(places.length / placesPerPage)) {
      setCurrentPage(pagina);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<any>): void => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShowCreate = (): void => {
    setFormData({
      name: '',
      company_id: selectedCompanyId || ''
    });
    setShowCreateModal(true);
  };

  const handleShowEdit = async (placeId: number): Promise<void> => {
    try {
      const res = await axios.get(`/api/places/${placeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setFormData(res.data);
      setShowEditModal(true);
    } catch (err: any) {
      setError('Erro ao buscar local para edição.');
    }
  };

  const handleShowDelete = (placeId: number): void => {
    setDeletePlaceId(placeId);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<any>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    try {
      const isEditing = showEditModal;
      const url = isEditing ? `/api/places/${(formData as any).id}` : '/api/places';
      const method = isEditing ? 'put' : 'post';
      
      await axios[method](url, formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setShowCreateModal(false);
      setShowEditModal(false);
      fetchAllPlaces();
    } catch (err: any) {
      setError('Erro ao salvar local.');
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await axios.delete(`/api/places/${deletePlaceId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setShowDeleteModal(false);
      setDeletePlaceId(null);
      fetchAllPlaces();
    } catch (err: any) {
      setError('Erro ao deletar local.');
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Locais</h2>
        <div>
          <Button variant="primary" className="me-2" onClick={handleShowCreate}>
           + Novo Local
          </Button>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* busca */}
      <div style={{ marginBottom: 20 }}>
        <Form.Control
          name="search"
          placeholder="Buscar por nome do local..."
          value={filters.search}
          onChange={handleFilterChange}
          style={{ maxWidth: 400 }}
        />
      </div>

      {placesParaExibir.length === 0 ? (
        <p>Nenhum local encontrado</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome do Local</th>
                <th>Clínica</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {placesParaExibir.map(place => (
                <tr key={place.id}>
                  <td>{place.name}</td>
                  <td>{'-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <Button variant="warning" size="sm" onClick={() => handleShowEdit(place.id)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleShowDelete(place.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* paginação */}
          {Math.ceil(places.length / placesPerPage) > 1 && (
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
                
                {Array.from({ length: Math.ceil(places.length / placesPerPage) }, (_, i) => i + 1).map(page => (
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
                  disabled={currentPage === Math.ceil(places.length / placesPerPage)}
                />
                <Pagination.Last 
                  onClick={() => irParaPagina(Math.ceil(places.length / placesPerPage))} 
                  disabled={currentPage === Math.ceil(places.length / placesPerPage)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* modal (form de criar e editar) */}
      <Modal show={showCreateModal || showEditModal} onHide={() => { setShowCreateModal(false); setShowEditModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{showEditModal ? 'Editar Local' : 'Novo Local'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nome do Local</Form.Label>
              <Form.Control 
                name="name" 
                type="text" 
                required 
                value={formData.name || ''} 
                onChange={handleFormChange} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* modal para excluir */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Local</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este local?
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

export default Places; 