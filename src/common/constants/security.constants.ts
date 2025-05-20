// src/common/constants/security.constants.ts

export const SECURITY_CONSTANTS = {
  headers: {
    poweredBy: 'x-powered-by',
    forwardedFor: 'x-forwarded-for',
    realIp: 'x-real-ip',
    correlationId: 'x-correlation-id',
    permissionsPolicy: 'Permissions-Policy',
    contentType: 'Content-Type',
    xContentTypeOptions: 'X-Content-Type-Options',
  },

  values: {
    noSniff: 'nosniff',
  },

  cors: {
    origins: ['https://tudominio.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    headers: ['Content-Type', 'Authorization'],
  },

  static: {
    relativePath: '../../../public',
    maxAge: '1y',
  },

  body: {
    jsonLimit: '100kb',
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  },

  express: {
    trustProxy: 'trust proxy',
    apiPrefix: 'api/v1',
    timeoutMs: 5000,
  },

  httpPolicies: {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrer: 'same-origin' as const,
    permissions: 'geolocation=(), microphone=(), camera=()',
    defaultContentType: 'application/json',
  },

  helmet: {
    frameguardAction: 'deny' as const,
  },

  httpMethods: {
    options: 'OPTIONS',
  },

  errorMessages: {
    methodNotAllowed: 'Method Not Allowed',
    timeout: 'Request timed out',
  },

  health: {
    endpoint: '/healthz',
    fullEndpoint: '/api/v1/healthz',
  },
};
