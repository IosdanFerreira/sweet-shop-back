import { doubleCsrf } from 'csrf-csrf';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // false for local development
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  },
  getCsrfTokenFromRequest: (req) => req.headers['x-xsrf-token'] as string,
  size: 64,
  getSessionIdentifier: (req) => {
    return req.cookies['session-id'] || 'anonymous';
  },
});
