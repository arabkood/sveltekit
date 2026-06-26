import { publicEnv } from '$config';

export const API_BASE_URL = publicEnv.PUBLIC_API_PATH;

export const API_ENDPOINTS = {
	auth: {
		signup: API_BASE_URL + '/auth/signup',
		signin: API_BASE_URL + '/auth/signin',
		signout: API_BASE_URL + '/auth/signout',
		verifyEmail: API_BASE_URL + '/auth/verify-email',
		resendEmailVerification: API_BASE_URL + '/auth/resend-email-verification',
		forgotPassword: API_BASE_URL + '/auth/forgot-password',
		resetPassword: API_BASE_URL + '/auth/reset-password',
		changePassword: API_BASE_URL + '/auth/change-password'
	},
	user: {
		me: {
			put: API_BASE_URL + '/user/me/profile'
		}
	},
	tracks: {
		start: API_BASE_URL + '/track/start'
	},
	item: {
		submit: (itemId: string) => API_BASE_URL + `/item/submit/${itemId}`,
		run: (itemId: string) => API_BASE_URL + `/item/run/${itemId}`,
		get_run: (taskId: string) => API_BASE_URL + `/item/run/${taskId}/status`
	}
};
