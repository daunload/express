/**
 * GitHub Action의 client_payload에 포함될 데이터 모델
 */
export interface GithubDispatchPayload {
	triggeredBy: string;
	message: string;
	timestamp: string;
}
