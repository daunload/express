import axios from 'axios';
import type { GithubDispatchPayload } from '../models/workflowModel';

const GITHUB_OWNER = 'daunload';
const GITHUB_REPO = 'express';
const GITHUB_TOKEN = process.env.GITHUB_PAT;
const EVENT_TYPE = 'build';
const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;

export const WorkflowService = {
	async triggerWorkflow(payload: GithubDispatchPayload) {
		try {
			const response = await axios.post(
				url,
				{
					event_type: EVENT_TYPE,
					client_payload: payload,
				},
				{
					headers: {
						Accept: 'application/vnd.github.v3+json',
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						'X-GitHub-Api-Version': '2022-11-28',
					},
				},
			);

			if (response.status !== 204) {
				throw new Error(`GitHub API status: ${response.status}`);
			}
		} catch (error) {
			console.error('워크플로우 실행 요청 중 오류');
			if (axios.isAxiosError(error)) {
				console.error(
					'오류 상세 정보:',
					error.response?.data || error.message,
				);
			}
			// 컨트롤러에서 처리할 수 있도록 에러를 다시 던집니다.
			throw new Error('Failed to trigger GitHub workflow.');
		}
	},
};
