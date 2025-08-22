import { authenticateToken } from '../middlewares/authenticateToken.js';
import companiesRouter from '../routes/companies.js';
import patientsRouter from '../routes/patients.js';
import placesRouter from '../routes/places.js';
import attendancesRouter from '../routes/attendances.js';
import usersRouter from '../routes/users.js';
import usersAuthRouter from '../routes/auth.js';
import dashboardRouter from '../routes/dashboard.js';
import reportsRouter from '../routes/reports.js';

export default function setupRoutes(app) {
  // rota de autenticação (não protegida)
  app.use('/api/auth', usersAuthRouter);
  
  // rotas protegidas por autenticação + validação de query params
  app.use('/api/companies', authenticateToken, companiesRouter);
  app.use('/api/patients', authenticateToken, patientsRouter);
  app.use('/api/places', authenticateToken, placesRouter);
  app.use('/api/attendances', authenticateToken, attendancesRouter);
  app.use('/api/users', usersRouter); //sem token so pra teste
  app.use('/api/dashboard', authenticateToken, dashboardRouter);
  app.use('/api/reports', authenticateToken, reportsRouter);
} 