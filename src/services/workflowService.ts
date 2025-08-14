import axios from 'axios';

const GITHUB_OWNER = 'daunload';
const GITHUB_REPO = 'express';
const GITHUB_TOKEN = process.env.GITHUB_PAT;
const EVENT_TYPE = 'build';
const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;

export const WorkflowService = {
	async triggerWorkflow() {
		if (!GITHUB_TOKEN) {
			console.error('GitHub 토큰이 서버에 설정되지 않았습니다.');
		}

		try {
			const response = await axios.post(
				url,
				{
					event_type: EVENT_TYPE,
				},
				{
					headers: {
						Accept: 'application/vnd.github.v3+json',
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						'X-GitHub-Api-Version': '2022-11-28',
					},
				},
			);

			// 2. GitHub API가 성공(204) 외 다른 상태를 반환한 경우
			if (response.status !== 204) {
				console.error(`GitHub API(Status: ${response.status})`);
			}

			return;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const status = error.response.status;
				const message =
					error.response.data?.message ||
					'알 수 없는 GitHub API 오류';

				if (status === 401) {
					console.error('GitHub API 인증 실패. PAT토큰 체크');
				}
				if (status === 404) {
					console.error('GitHub 리포지토리를 찾을 수 없습니다.');
				}
				if (status === 422) {
					console.error(`잘못된 요청입니다: ${message}`);
				}

				console.error(`GitHub API 오류: ${message}`);
			}

			console.error('워크플로우 실행 요청 중 알 수 없는 오류');
		}
	},
};
