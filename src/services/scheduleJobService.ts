import { Cron } from 'croner';
import { AppError } from '../utils/errors';

const scheduleJobs = new Map<string, Cron>();
export const ScheduleJobService = {
	init() {},
	create(id: string, actionDate: string, callback: () => void) {
		if (scheduleJobs.has(id))
			throw new AppError('INVALID_ID', 400, 'id가 중복되었습니다.');

		const job = new Cron(actionDate, { timezone: 'Asia/Seoul' }, callback);
		scheduleJobs.set(id, job);
	},
	remove(id: string) {
		if (!scheduleJobs.has(id))
			throw new AppError('NOT_FOUND', 404, '삭제할 스케줄이 없습니다.');

		scheduleJobs.get(id)?.stop();
		scheduleJobs.delete(id);
	},
};
