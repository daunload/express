import { Cron } from 'croner';
import AppError from '../utils/errors';

const scheduleJobs = new Map<string, Cron>();
export const ScheduleJobService = {
	create(id: string, actionDate: string, callback: () => void) {
		if (scheduleJobs.has(id))
			throw new AppError('id가 중복되었습니다.', 400);

		const job = new Cron(actionDate, { timezone: 'Asia/Seoul' }, () => {
			callback();
			ScheduleJobService.remove(id);
		});
		scheduleJobs.set(id, job);
	},
	remove(id: string) {
		if (!scheduleJobs.has(id))
			throw new AppError('삭제할 스케줄이 없습니다.', 400);

		scheduleJobs.get(id)?.stop();
		scheduleJobs.delete(id);
	},
};
