import { Application } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import companiesRouter from '../routes/companies';
import patientsRouter from '../routes/patients';
import placesRouter from '../routes/places';
import attendancesRouter from '../routes/attendances';
import usersRouter from '../routes/users';
import usersAuthRouter from '../routes/auth';
import dashboardRouter from '../routes/dashboard';
import reportsRouter from '../routes/reports';

export default function setupRoutes(app: Application): void {
  // rota de autenticação (não protegida)
  app.use('/api/auth', usersAuthRouter);
  
  // rotas protegidas por autenticação + validação de query params
  app.use('/api/companies', authenticateToken, companiesRouter);
  app.use('/api/patients', authenticateToken, patientsRouter);
  app.use('/api/places', authenticateToken, placesRouter);
  app.use('/api/attendances', authenticateToken, attendancesRouter);
  app.use('/api/users', authenticateToken, usersRouter); //sem token so pra teste
  app.use('/api/dashboard', authenticateToken, dashboardRouter);
  app.use('/api/reports', authenticateToken, reportsRouter);
}
