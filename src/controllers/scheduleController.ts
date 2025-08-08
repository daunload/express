import type { Request, Response } from 'express';
import { getDatabase } from '../db';

export const getAllSchedules = async (req: Request, res: Response) => {
	try {
		const db = getDatabase();
		const schedules = await db.collection('schedule').find({}).toArray();
		res.status(200).json(schedules);
	} catch (error) {
		console.error('스케쥴 조회 오류:', error);
		res.status(500).json({
			message: '스케쥴 조회 중 오류가 발생했습니다.',
		});
	}
};

export const addSchedule = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		const { title, action_date } = req.body;
		const db = getDatabase();
		const schedules = await db.collection('schedule').insertOne({
			title: title,
			action_date: action_date,
		});
		res.status(200).json(schedules);
	} catch (error) {
		console.error('스케쥴 추가 오류:', error);
		res.status(500).json({
			message: '스케쥴 추가 중 오류가 발생했습니다.',
		});
	}
};
