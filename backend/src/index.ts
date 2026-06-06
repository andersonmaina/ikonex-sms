import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import classStreamsRouter from './routes/classStreams';
import studentsRouter from './routes/students';
import gradesRouter from './routes/grades';
import subjectsRouter from './routes/subjects';
import analyticsRouter from './routes/analytics';
import reportsRouter from './routes/reports';

app.use(cors());
app.use(express.json());

app.use('/api/class-streams', classStreamsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/reports', reportsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ikonex: healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});