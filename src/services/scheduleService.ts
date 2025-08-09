import { isValidObjectId } from 'mongoose';
import { ScheduleModel } from '../models/scheduleModel';
import { AppError } from '../utils/errors';

export const ScheduleService = {
	async getAll() {
		return ScheduleModel.find().sort({ startsAt: 1 }).lean();
	},

	async create(data: { title: string; action_date: string }) {
		if (!data.title?.trim()) {
			throw new AppError('INVALID_INPUT', 400, '제목은 필수입니다.');
		}
		if (Date.now() > new Date(data.action_date).getTime()) {
			throw new AppError(
				'INVALID_INPUT',
				400,
				'유효하지 않은 actionDate',
			);
		}
		const schedule = await ScheduleModel.insertOne({
			title: data.title,
			action_date: data.action_date,
		});

		return schedule.toObject();
	},

	async remove(id: string) {
		if (!isValidObjectId(id)) {
			throw new AppError(
				'INVALID_ID',
				400,
				'유효하지 않은 ObjectId입니다.',
			);
		}
		const { deletedCount } = await ScheduleModel.deleteOne({ _id: id });
		if (!deletedCount) {
			throw new AppError('NOT_FOUND', 404, '삭제할 스케줄이 없습니다.');
		}
		return { deleted: true };
	},
};
