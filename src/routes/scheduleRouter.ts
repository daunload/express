import express, { type Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';

const scheduleRouter: Router = express.Router();

scheduleRouter.get('/', ScheduleController.getAll);
scheduleRouter.post('/add', ScheduleController.create);
scheduleRouter.post('/remove', ScheduleController.remove);

export { scheduleRouter };
