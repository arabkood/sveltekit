export type AuthState = {
	id: string;
	authenticated: boolean;
	username: string;
	email: string;
	emailVerified: boolean;
	emailVerificationAlreadySent?: boolean;
	canResendCodeAt?: number;
};
