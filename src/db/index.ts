import { type Db, MongoClient, type MongoClientOptions } from 'mongodb';

// 연결 옵션 타입 정의
interface DatabaseConfig {
	connectionString: string;
	databaseName: string;
	options?: MongoClientOptions;
}

class DatabaseConnection {
	private static instance: DatabaseConnection;
	private client: MongoClient | null = null;
	private db: Db | null = null;
	private config: DatabaseConfig;

	private constructor() {
		this.config = {
			connectionString: process.env.DB_URL || '',
			databaseName: process.env.DB_NAME || 'auto_deploy',
			options: {
				maxPoolSize: 10,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMS: 45000,
				family: 4,
			},
		};

		if (!this.config.connectionString) {
			throw new Error('DB_URL 환경변수가 설정되지 않았습니다.');
		}
	}

	// 싱글톤 패턴으로 인스턴스 생성
	public static getInstance(): DatabaseConnection {
		if (!DatabaseConnection.instance) {
			DatabaseConnection.instance = new DatabaseConnection();
		}
		return DatabaseConnection.instance;
	}

	// 데이터베이스 연결
	public async connect(): Promise<Db> {
		try {
			if (this.db) {
				return this.db;
			}

			console.log('MongoDB에 연결 중...');
			this.client = new MongoClient(
				this.config.connectionString,
				this.config.options,
			);

			await this.client.connect();

			// 연결 테스트
			await this.client.db('admin').command({ ping: 1 });

			this.db = this.client.db(this.config.databaseName);

			console.log(
				`MongoDB에 성공적으로 연결되었습니다. 데이터베이스: ${this.config.databaseName}`,
			);

			return this.db;
		} catch (error) {
			console.error('MongoDB 연결 오류:', error);
			throw new Error(
				`데이터베이스 연결 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	// 데이터베이스 연결 해제
	public async disconnect(): Promise<void> {
		try {
			if (this.client) {
				await this.client.close();
				this.client = null;
				this.db = null;
				console.log('MongoDB 연결이 해제되었습니다.');
			}
		} catch (error) {
			console.error('MongoDB 연결 해제 오류:', error);
			throw error;
		}
	}

	// 연결 상태 확인
	public isConnected(): boolean {
		return this.client !== null && this.db !== null;
	}

	// 현재 데이터베이스 반환
	public getDatabase(): Db {
		if (!this.db) {
			throw new Error(
				'데이터베이스가 연결되지 않았습니다. connect()를 먼저 호출하세요.',
			);
		}
		return this.db;
	}

	// 클라이언트 반환 (필요한 경우)
	public getClient(): MongoClient {
		if (!this.client) {
			throw new Error(
				'클라이언트가 연결되지 않았습니다. connect()를 먼저 호출하세요.',
			);
		}
		return this.client;
	}
}

// 데이터베이스 인스턴스 내보내기
const dbInstance = DatabaseConnection.getInstance();

// 데이터베이스 연결 함수
export const connectToDatabase = async (): Promise<Db> => {
	return await dbInstance.connect();
};

// 데이터베이스 연결 해제 함수
export const disconnectFromDatabase = async (): Promise<void> => {
	return await dbInstance.disconnect();
};

// 데이터베이스 가져오기 함수
export const getDatabase = (): Db => {
	return dbInstance.getDatabase();
};

// 연결 상태 확인 함수
export const isDatabaseConnected = (): boolean => {
	return dbInstance.isConnected();
};

// 기본 내보내기 (기존 코드와의 호환성을 위해)
export default dbInstance;

// 프로세스 종료 시 연결 정리
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
