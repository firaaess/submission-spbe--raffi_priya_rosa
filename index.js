import express from 'express';
import routes from './routes/routes.js';
// import { authenticateJWT } from './middlewares/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Routes untuk Auth
app.use('/api', routes);

// app.listen(9090, () => {
//   console.log(`Server is running on http://localhost:9090`);
// });

export default app;