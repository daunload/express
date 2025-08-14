import type { Request, Response } from 'express';
import type { GithubDispatchPayload } from '../models/workflowModel';
import { WorkflowService } from '../services/workflowService';

export const WorkflowController = {
	async triggerAction(req: Request, res: Response): Promise<void> {
		try {
			const payload: GithubDispatchPayload = {
				message: 'message',
				triggeredBy: 'daunload',
				timestamp: new Date().toISOString(),
			};

			await WorkflowService.triggerWorkflow(payload);

			res.status(202).json({
				success: true,
				message: 'Workflow trigger request accepted.',
			});
		} catch (error) {
			// 서비스에서 발생한 에러 처리
			res.status(500).json({
				success: false,
				message: (error as Error).message,
			});
		}
	},
};
