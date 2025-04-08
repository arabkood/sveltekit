export interface ApiError {
	error: ApiErrMessages;
}

export enum ApiErrMessages {
	// User-related errors
	ErrConflictUsername = 'USERNAME_CONFLICT',
	ErrConflictEmail = 'EMAIL_CONFLICT',
	ErrUserNotFound = 'USER_NOT_FOUND',

	// Authorization-related errors
	ErrMissingAuthorizationToken = 'MISSING_AUTHORIZATION_TOKEN',
	ErrInvalidAuthorizationToken = 'INVALID_AUTHORIZATION_TOKEN',
	ErrInvalidAuthorizationTokenClaims = 'INVALID_AUTHORIZATION_TOKEN_CLAIMS',
	ErrAccessDenied = 'ACCESS_DENIED',

	// Login-related errors
	ErrBadLogin = 'BAD_LOGIN',

	// Internal errors
	ErrInternalServerError = 'INTERNAL_ERROR',
	ErrSomethingWentWrong = 'SOMETHING_WENT_WRONG',

	// Module-related errors
	ErrModuleNotFound = 'MODULE_NOT_FOUND',
	ErrDidntStartModule = 'MODULE_NOT_STARTED',
	ErrModuleFinished = 'MODULE_FINISHED',

	// Track-related errors
	ErrTrackNotFound = 'TRACK_NOT_FOUND',
	ErrAlreadyStartedTrack = 'TRACK_ALREADY_STARTED',
	ErrDidntStartTrack = 'TRACK_NOT_STARTED',

	// Exercise-related errors
	ErrExerciseNotFound = 'EXERCISE_NOT_FOUND'
}

export enum ApiMessages {
	// Validation errors
	InvalidField = 'BAD_FIELD',
	InvalidFieldRequired = 'REQUIRED_FIELD',
	InvalidMinLength = 'UNMET_MINIMUM',
	InvalidMaxLength = 'UNMET_MAXIMUM',
	InvalidLength = 'UNMET_LENGTH',
	InvalidEmail = 'BAD_EMAIL',

	// Informational messages
	InfoUserCreated = 'USER_CREATED',
	InfoSuccess = 'SUCCESS'
}

export interface ApiTimestamp {
	Microseconds: number;
	Valid: boolean;
}

export const ApiErrMessagesNew = [
	'USERNAME_CONFLICT',
	'EMAIL_CONFLICT',
	'INVALID_INPUT',
	'INVALID_EMAIL',
	'INVALID_USERNAME',
	'INVALID_PASSWORD',
	'BAD_CREDENTIALS',
	'ACCOUNT_LOCKED',
	'INVALID_RESET_PASSWORD_TOKEN',
	'EXPIRED_RESET_PASSWORD_TOKEN',
	'USER_NOT_FOUND',
	'PREMIUM_ONLY',
	'TRACK_NOT_FOUND',
	'MODULE_NOT_FOUND',
	'ACCESS_DENIED',
	'MISSING_AUTHORIZATION_TOKEN',
	'INVALID_AUTHORIZATION_TOKEN',
	'EXPIRED_AUTHORIZATION_TOKEN',
	'FREE_RATE_LIMIT_EXCEEDED',
	'RATE_LIMIT_EXCEEDED',
	'PRIVATE_USER'
];
