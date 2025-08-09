import { Schema, model, type InferSchemaType } from 'mongoose';

const scheduleSchema = new Schema(
	{
		title: { type: String, required: true },
		action_date: { type: String, required: true, unique: true },
		is_done: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

export type Schedule = InferSchemaType<typeof scheduleSchema>;
export const ScheduleModel = model<Schedule>('schedule', scheduleSchema);
