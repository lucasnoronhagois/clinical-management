import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import { Sequelize } from 'sequelize';
import { loadModels } from './config/database';
import setupRoutes from './config/configrouter';
import cors from 'cors';

const app: Application = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

//chamar os dados do env
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: false, // sem logging pra nao encher o terminal do server
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.sequelize = sequelize;
// Middleware para log de todas as requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Rota chamada:', req.method, req.originalUrl);
    next();
  });
}

// só inicia o servidor depois do sync com o banco
const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === 'development') {
      console.log('Conexão com o banco de dados estabelecida!');
    }
    
    // Carregar models
    const models = loadModels(sequelize);
    if (process.env.NODE_ENV === 'development') {
      console.log('Models carregados com sucesso!');
    }

    // Configurar rotas
    setupRoutes(app);

    const PORT = 3000;
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`http://localhost:${PORT}`);
      }
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

startServer();
