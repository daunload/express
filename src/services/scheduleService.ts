import { isValidObjectId } from 'mongoose';
import { ScheduleModel } from '../models/scheduleModel';
import { AppError } from '../utils/errors';

export const ScheduleService = {
	async getAll() {
		return ScheduleModel.find().sort({ startsAt: 1 }).lean();
	},

	async create(title: string, actionDate: string) {
		const schedule = await ScheduleModel.create({
			title: title,
			action_date: actionDate,
		});

		return schedule.toObject();
	},

    async done(id: string) {
        const { upsertedId, acknowledged, matchedCount } = await ScheduleModel.updateOne({ _id: id }, { is_done: true });

        if (!acknowledged) throw new Error("Mongo write not acknowledged");
        if (matchedCount === 0 && !upsertedId) throw new Error("No document matched the filter");

        return { done: true};
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
