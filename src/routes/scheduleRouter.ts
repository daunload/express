import express, { type Router } from 'express';
import {
	addSchedule,
	getAllSchedules,
	removeSchedule,
} from '../controllers/scheduleController';

const scheduleRouter: Router = express.Router();

scheduleRouter.get('/', getAllSchedules);
scheduleRouter.post('/add', addSchedule);
scheduleRouter.post('/remove', removeSchedule);

export { scheduleRouter };
