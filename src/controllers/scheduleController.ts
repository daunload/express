import type { NextFunction, Request, Response } from 'express';
import { ScheduleService } from '../services/scheduleService';
import { isValidUTCISO } from '../utils/day';
import AppError from '../utils/errors';

export const ScheduleController = {
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = ScheduleService.getAll();
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
		} catch (err) {
			next(err);
		}
	},

	async create(req: Request, res: Response, next: NextFunction) {
		const { title, action_date } = req.body;

		try {
			if (!title || !title.trim())
				throw new AppError('제목 입력해줘', 400);

			if (
				!isValidUTCISO(action_date) ||
				Date.now() > new Date(action_date).getTime()
			) {
				return next(new AppError('유효하지 않은 actionDate', 400));
			}

			const result = await ScheduleService.create(title, action_date);
			res.status(201).json(result);
		} catch (err) {
			next(err);
		}
	},
};
