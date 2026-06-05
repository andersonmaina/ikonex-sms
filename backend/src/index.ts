import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import classStreamsRouter from './routes/classStreams';
import studentsRouter from './routes/students';
import gradesRouter from './routes/grades';

app.use(cors());
app.use(express.json());

app.use('/api/class-streams', classStreamsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/grades', gradesRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ikonex: healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});