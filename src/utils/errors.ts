export class AppError extends Error {
	code: string;
	status: number;
	constructor(code: string, status = 400, message?: string) {
		super(message ?? code);
		this.code = code;
		this.status = status;
	}
}
