import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './db';
import { scheduleRouter } from './routes/scheduleRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/schedule', scheduleRouter);

app.listen(PORT, async () => {
	try {
		await connectToDatabase();
		console.log(`🚀 Server is running on http://localhost:${PORT}`);
	} catch (error) {
		console.error('서버 시작 오류:', error);
		process.exit(1);
	}
});
