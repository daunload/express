// env.d.ts
declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		DB_URL: string;
		DB_NAME: string;
	}
}
