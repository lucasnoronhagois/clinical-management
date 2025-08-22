import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Sequelize } from 'sequelize';
import { loadModels } from './config/database.js';
import setupRoutes from './config/configrouter.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

//chamar os dados do env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // sem logging pra nao encher o terminal do server
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.sequelize = sequelize;
app.use((req, res, next) => { //lembrar de tirar, tô usando pra organizar os acessos
  console.log('Rota chamada:', req.method, req.originalUrl);
  next();
});

// só inicia o servidor depois do sync com o banco
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida!');
    
    // Carregar models
    const models = loadModels(sequelize);
    console.log('Models carregados com sucesso!');

    // Configurar rotas
    setupRoutes(app);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

startServer(); 