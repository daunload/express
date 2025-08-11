import type { NextFunction, Request, Response } from 'express';
import { ScheduleService } from '../services/scheduleService';
import { ScheduleJobService } from '../services/scheduleJobService'
import { AppError } from '../utils/errors';
import { isValidUTCISO } from '../utils/day';

export const ScheduleController = {
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await ScheduleService.getAll();
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	async remove(req: Request, res: Response, next: NextFunction) {
        const { id } = req.body;

		try {
			const result = await ScheduleService.remove(id);
			res.json(result);

            ScheduleJobService.remove(id);
		} catch (err) {
			next(err);
		}
	},

	async create(req: Request, res: Response, next: NextFunction) {
        const { title, action_date } = req.body;

		try {
            if (!title || !title.trim()) throw new AppError('INVALID_INPUT', 400, '제목 입력해줘');

            if (!isValidUTCISO(action_date)) {
                throw new AppError('INVALID_INPUT', 400, '유효하지 않은 actionDate');
            }

            if (Date.now() > new Date(action_date).getTime()) {
                throw new AppError(
                    'INVALID_INPUT',
                    400,
                    '유효하지 않은 actionDate',
                );
            }

			const result = await ScheduleService.create(title, action_date);
			res.status(201).json(result);

            ScheduleJobService.create(result._id.toString(), action_date, () => {
                ScheduleService.done(result._id.toString());
            });
		} catch (err) {
			next(err);
		}
	},
};
