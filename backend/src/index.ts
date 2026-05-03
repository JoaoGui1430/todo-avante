import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

import listRoutes from './routes/lists';
import taskRoutes from './routes/tasks';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Rodando em: http://localhost:${PORT}`);
});