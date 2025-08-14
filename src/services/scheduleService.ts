import { isValidObjectId, startSession } from 'mongoose';
import { ScheduleModel } from '../models/scheduleModel';
import AppError from '../utils/errors';
import { ScheduleJobService } from './scheduleJobService';
import { WorkflowService } from './workflowService';

export const ScheduleService = {
	async init() {
		const schedules = await ScheduleModel.find({}).lean();

		for (const schedule of schedules) {
			if (Date.now() > new Date(schedule.action_date).getTime()) {
				await ScheduleModel.updateOne(
					{ _id: schedule._id },
					{ $set: { is_done: true } },
				);
			} else {
				ScheduleJobService.create(
					schedule._id.toString(),
					schedule.action_date,
					() => {
						ScheduleService.done(schedule._id.toString());
						WorkflowService.triggerWorkflow();
					},
				);
			}
		}
	},

	async getAll() {
		return ScheduleModel.find().sort({ action_date: 1 }).lean();
	},

	async create(title: string, actionDate: string) {
		const session = await startSession();
		session.startTransaction();

		try {
			const schedule = await ScheduleModel.create(
				[
					{
						title: title,
						action_date: actionDate,
					},
				],
				{ session },
			);

			const newSchedule = schedule[0];

			if (!newSchedule) throw new Error('스케쥴 생성 실패');

			ScheduleJobService.create(
				newSchedule._id.toString(),
				actionDate,
				() => {
					ScheduleService.done(newSchedule._id.toString());
					WorkflowService.triggerWorkflow();
				},
			);

			await session.commitTransaction();
			return newSchedule.toObject();
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			session.endSession();
		}
	},

	async done(id: string) {
		if (!isValidObjectId(id)) {
			throw new AppError('유효하지 않은 ObjectId입니다.', 400);
		}

		const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
			id,
			{ is_done: true },
			{ new: true },
		).lean();

		if (!updatedSchedule) {
			throw new AppError('상태를 업데이트할 스케줄이 없습니다.', 404);
		}

		return updatedSchedule;
	},

	async remove(id: string) {
		if (!isValidObjectId(id)) {
			throw new AppError('유효하지 않은 ObjectId입니다.', 400);
		}

		const deletedSchedule =
			await ScheduleModel.findByIdAndDelete(id).lean();

		if (!deletedSchedule) {
			throw new AppError('삭제할 스케줄이 없습니다.', 404);
		}

		ScheduleJobService.remove(id);

		return deletedSchedule;
	},
};
