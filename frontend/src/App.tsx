import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import CompanySelection from './pages/CompanySelection';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Attendances from './pages/Attendances';
import Users from './pages/Users';
import Places from './pages/Places';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import PatientDetails from './pages/PatientDetails';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import './App.css';

function AppWrapper(): React.ReactElement {
  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
  }, []);
  
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div style={{ paddingTop: hideNavbar ? 0 : 64 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/company-selection" element={<CompanySelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/attendances" element={<Attendances />} />
          <Route path="/users" element={<Users />} />
          <Route path="/places" element={<Places />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
