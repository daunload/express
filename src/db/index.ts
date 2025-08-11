import mongoose from 'mongoose';

const connectToDatabase = async () => {
	const dbUrl = process.env.DB_URL;
	const dbName = process.env.DB_NAME;

	if (!dbUrl) throw new Error('DB_URL 환경변수가 설정되지 않았습니다.');
    if (!dbName) throw new Error('dbName 환경변수가 설정되지 않았습니다.');

	try {
		console.log('MongoDB에 연결 중...');
		await mongoose.connect(dbUrl, {
			dbName,
			autoIndex: true,
			serverSelectionTimeoutMS: 15000,
			socketTimeoutMS: 45000,
		});

		console.log(
			`MongoDB에 성공적으로 연결되었습니다. 데이터베이스: ${dbName}`,
		);

		mongoose.connection.on('error', (err) => {
			console.error('MongoDB 연결 오류:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB 연결이 끊겼습니다.');
		});
	} catch (error) {
		console.error('MongoDB 초기 연결 오류:', error);
		throw new Error(
			`데이터베이스 연결 실패: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
};

const disconnectFromDatabase = async () => {
	try {
		await mongoose.disconnect();
		console.log('MongoDB 연결이 해제되었습니다.');
	} catch (error) {
		console.error('MongoDB 연결 해제 오류:', error);
		throw error;
	}
};

process.on('SIGINT', async () => {
	console.log('\n애플리케이션 종료 중...');
	await disconnectFromDatabase();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('\n애플리케이션 종료 중...');
	await disconnectFromDatabase();
	process.exit(0);
});

export { connectToDatabase, disconnectFromDatabase };