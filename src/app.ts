import express from 'express';
import patientRoutes from './routes/patient.js';
import userRoutes from './routes/user.js';
import visitRouter from './routes/visit.js';
import serviceRouter from './routes/service.js';
import paymentRouter from './routes/payment.js';
import visit_serviceRouter from './routes/visit_service.js';
import helmet from 'helmet';
import cors from 'cors'

const app = express();
app.use(helmet());
app.use(cors())
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visits', visitRouter);
app.use('/api/services', serviceRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/visit_service', visit_serviceRouter);

export default app;