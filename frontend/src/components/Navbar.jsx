import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompanyId');
    navigate('/login');
  };

  const getUserInfo = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        let roleLabel = '';
        if (tokenPayload.root) {
          roleLabel = 'Administrador';
        } else if (tokenPayload.role === 'DOCTOR') {
          roleLabel = 'Doctor';
        } else if (tokenPayload.role === 'RECEPTIONIST') {
          roleLabel = 'Receptionist';
        } else {
          roleLabel = tokenPayload.role || 'N/A';
        }
        return {
          name: tokenPayload.name || tokenPayload.email || 'Usuário',
          roleLabel
        };
      }
    } catch (error) {
      // ignore
    }
    return { name: 'Usuário', roleLabel: 'N/A' };
  };

  const userInfo = getUserInfo();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <div className="container-fluid">
        <span className="navbar-brand" style={{ fontWeight: 600 }}>Sistema Cutruca</span>
        <div className="d-flex align-items-center ms-auto">
          {userInfo.roleLabel === 'Administrador' && (
            <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/dashboard')}>
              Início
            </button>
          )}
          <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/patients')}>
            Pacientes
          </button>
          <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/attendances')}>
            Atendimentos
          </button>
          <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/places')}>
            Locais
          </button>
          {userInfo.roleLabel === 'Administrador' && (
            <button className="btn btn-outline-light btn-sm me-2" onClick={() => handleNavClick('/reports')}>
              Relatórios
            </button>
          )}
          {userInfo.roleLabel === 'Administrador' && (
            <button className="btn btn-outline-light btn-sm me-3" onClick={() => handleNavClick('/users')}>
              Usuários
            </button>
          )}
          <span className="text-white me-3" style={{ fontSize: '0.95em' }}>
            {userInfo.name} <span style={{ opacity: 0.8 }}>({userInfo.roleLabel})</span>
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 