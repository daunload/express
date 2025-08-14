import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './db';
import { scheduleRouter } from './routes/scheduleRouter';
import { ScheduleService } from './services/scheduleService';

const app = express();

const PORT = Number(process.env.PORT) || 10000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
	res.send('어딜 들어와 꺼져');
});

app.use('/schedule', scheduleRouter);

const server = app.listen(PORT, HOST, async () => {
	try {
		await connectToDatabase();
		await ScheduleService.init();

		console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
	} catch (error) {
		console.error('서버 시작 오류:', error);
		process.exit(1);
	}
});

server.keepAliveTimeout = 120_000; // 120초
server.headersTimeout = 121_000; // keepAliveTimeout보다 약간 크게
