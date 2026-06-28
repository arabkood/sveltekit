import { publicEnv } from '$config';

export const API_BASE_URL = publicEnv.PUBLIC_API_PATH;

export const API_ENDPOINTS = {
	item: {
		run: (itemId: string) => API_BASE_URL + `/item/run/${itemId}`,
		get_run: (taskId: string) => API_BASE_URL + `/item/run/${taskId}/status`
	}
};
