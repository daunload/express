import express, { type Router } from 'express';
import {
	addSchedule,
	getAllSchedules,
} from '../controllers/scheduleController';

const scheduleRouter: Router = express.Router();

scheduleRouter.get('/', getAllSchedules);
scheduleRouter.post('/add', addSchedule);

export { scheduleRouter };
