import type { Request, Response, NextFunction } from 'express';
import { ScheduleService } from '../services/scheduleService';

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
		try {
			const result = await ScheduleService.remove(req.body.id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			console.log(req.body);
			const result = await ScheduleService.create(req.body);
			res.status(201).json(result);
		} catch (err) {
			next(err);
		}
	},
};
