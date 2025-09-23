import { env } from '$env/dynamic/public';

export const APP_ENV = env.PUBLIC_APP_ENV || 'dev';
export const isLocal = APP_ENV === 'local';

export const S3_PUBLIC_BUCKET_NAME = env.PUBLIC_AWS_S3_PUBLIC_BUCKET_NAME!;

export const ARABKOOD_API_BASE_URL =
  env.PUBLIC_ARABKOOD_API_BASE_URL || 'https://alpha.akood.com/api/v1';

export const auth = {
  authStateCookieName: 'arabkood_auth_state',
  sessionCookieName: 'arabkood_session_token'
};

export const POLAR_PRODUCTS = {
  premium_yearly: env.PUBLIC_POLAR_PRODUCT_ID_PREMIUM_YEARLY,
  premium_monthly: env.PUBLIC_POLAR_PRODUCT_ID_PREMIUM_MONTHLY,
}
