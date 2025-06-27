import { ARABKOOD_API_BASE_URL } from '$config';

export const API_BASE_URL = ARABKOOD_API_BASE_URL;
// export const API_BASE_URL = 'http://api.dev.arabkood.com:2007/api/v1';

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
	userTracks: {
		// get: (trackId: string) => API_BASE_URL + `/user_tracks/get/${trackId}`,
		// list: API_BASE_URL + '/user_tracks/list'
	},
	userModules: {
		// get: (moduleId: string) => API_BASE_URL + `/user_modules/get/${moduleId}`,
		// list: (trackId: string) => API_BASE_URL + `/user_modules/list/${trackId}`,
		// run: (moduleId: string) => API_BASE_URL + `/user_modules/run/${moduleId}`
	},
	item: {
		// codeAttempt: (itemId: string) => API_BASE_URL + `/item/code/attempt/${itemId}`,
		submit: (itemId: string) => API_BASE_URL + `/item/submit/${itemId}`
	}
	// modules: {
	// 	get: (moduleSlug: string) => API_BASE_URL + `/module/${moduleSlug}`,
	// 	// getResult: (exerciseID: string) => API_BASE_URL + `/exercise/result/${exerciseID}`,
	// 	attempt: (moduleId: string) => API_BASE_URL + `/module/attempt/${moduleId}`,
	// 	// getSubmission: (moduleId: string) => API_BASE_URL + `/module/submission/${moduleId}`,
	// 	getAttempt: (attemptId: string) => API_BASE_URL + `/module/attempt/${attemptId}`
	// }
};
