// src/common/config/security-configurator.ts
import { APP_CONSTANTS } from '@common/constants/app.constants';
import { SECURITY_CONSTANTS as CONSTANTS } from '@common/constants/security.constants';
import { LogMethod } from '@common/decorators/logged-method.decorator';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import * as path from 'path';

export class SecurityConfigurator {
  constructor(private readonly _app: NestExpressApplication) {}

  public apply(): void {
    this.configureProxyTrust();
    this.configureSecurityHeaders();
    this.configureRateLimiter();
    this.configureBodyParsers();
    this.configureHttpPollutionProtection();
    this.configureCompression();
    this.configureStaticFiles();
    this.configureCorsPolicy();
    this.configureValidationPipe();
    this.configureGlobalTimeouts();
    this.configureApiVersioning();
    this.configureDefaultHeaders();
    this.configureMethodRestrictions();
    this.configurePreflightHandler();
    this.configureHttpUsageWarning();
    this.configureMaintenanceMode();
    this.configureHealthEndpoints();
  }

  @LogMethod
  private configureProxyTrust(): void {
    this._app.set(CONSTANTS.express.trustProxy, true);
  }

  @LogMethod
  private configureSecurityHeaders(): void {
    this._app.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: { action: CONSTANTS.helmet.frameguardAction },
        hidePoweredBy: true,
        xssFilter: true,
      }),
    );

    this._app.use(helmet.hsts(CONSTANTS.httpPolicies.hsts));
    this._app.use(helmet.referrerPolicy({ policy: CONSTANTS.httpPolicies.referrer }));

    this._app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader(CONSTANTS.headers.permissionsPolicy, CONSTANTS.httpPolicies.permissions);
      next();
    });

    this._app.disable(CONSTANTS.headers.poweredBy);
  }

  @LogMethod
  private configureRateLimiter(): void {
    this._app.use(
      rateLimit({
        windowMs: CONSTANTS.rateLimit.windowMs,
        max: CONSTANTS.rateLimit.maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (request: Request): string => {
          const FORWARDED = request.headers[CONSTANTS.headers.forwardedFor];
          if (typeof FORWARDED === 'string') {
            return FORWARDED.split(',')[0].trim();
          }
          return request?.ip ?? '';
        },
      }),
    );
  }

  @LogMethod
  private configureBodyParsers(): void {
    this._app.use(express.json({ limit: CONSTANTS.body.jsonLimit }));
    this._app.use(express.urlencoded({ extended: true }));
  }

  @LogMethod
  private configureHttpPollutionProtection(): void {
    this._app.use(hpp());
  }

  @LogMethod
  private configureCompression(): void {
    this._app.use(compression());
  }

  @LogMethod
  private configureStaticFiles(): void {
    this._app.use(
      express.static(path.join(__dirname, CONSTANTS.static.relativePath), {
        maxAge: CONSTANTS.static.maxAge,
      }),
    );
  }

  @LogMethod
  private configureCorsPolicy(): void {
    this._app.enableCors({
      origin: CONSTANTS.cors.origins,
      methods: CONSTANTS.cors.methods,
      allowedHeaders: CONSTANTS.cors.headers,
      credentials: true,
    });
  }

  @LogMethod
  private configureValidationPipe(): void {
    this._app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
  }

  @LogMethod
  private configureGlobalTimeouts(): void {
    this._app.use((request: Request, response: Response, next: NextFunction) => {
      response.setTimeout(CONSTANTS.express.timeoutMs, () => {
        console.info(`[Timeout] ${request.method} ${request.originalUrl}`);
        response.status(HttpStatus.SERVICE_UNAVAILABLE).json(GlobalResponseService.getSecurityCriticalGlobalResponse(CONSTANTS.errorMessages.timeout));
      });
      next();
    });
  }

  @LogMethod
  private configureApiVersioning(): void {
    this._app.setGlobalPrefix(CONSTANTS.express.apiPrefix);
  }

  @LogMethod
  private configureDefaultHeaders(): void {
    this._app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader(CONSTANTS.headers.contentType, CONSTANTS.httpPolicies.defaultContentType);
      response.setHeader(CONSTANTS.headers.xContentTypeOptions, CONSTANTS.values.noSniff);
      next();
    });
  }

  @LogMethod
  private configureMethodRestrictions(): void {
    this._app.use((request: Request, response: Response, next: NextFunction) => {
      const ALLOWED = CONSTANTS.cors.methods.map((m) => m.toUpperCase());
      if (!ALLOWED.includes(request.method.toUpperCase())) {
        return response.status(HttpStatus.METHOD_NOT_ALLOWED).json(GlobalResponseService.getSecurityCriticalGlobalResponse(CONSTANTS.errorMessages.methodNotAllowed));
      }
      next();
    });
  }

  @LogMethod
  private configurePreflightHandler(): void {
    this._app.use((request: Request, response: Response, next: NextFunction) => {
      if (request.method === CONSTANTS.httpMethods.options) {
        return response.sendStatus(HttpStatus.NO_CONTENT);
      }
      next();
    });
  }

  @LogMethod
  private configureHttpUsageWarning(): void {
    this._app.use((req: Request, res: Response, next: NextFunction) => {
      const IS_SECURE = req.secure || req.headers['x-forwarded-proto'] === 'https';

      if (!IS_SECURE) {
        return res.status(HttpStatus.OK).json(GlobalResponseService.getSecurityWarningGlobalResponse(APP_CONSTANTS.message.yourAreUsingInsecureConnection()));
      }

      next();
    });
  }

  @LogMethod
  private configureMaintenanceMode(): void {
    this._app.use((req: Request, res: Response, next: NextFunction) => {
      if (process.env.MAINTENANCE_MODE === 'true') {
        return res.status(HttpStatus.SERVICE_UNAVAILABLE).json(GlobalResponseService.getSecurityWarningGlobalResponse(APP_CONSTANTS.message.maintenanceModeEnabled()));
      }

      next();
    });
  }

  @LogMethod
  private configureHealthEndpoints(): void {
    this._app.use(CONSTANTS.health.endpoint, (req: Request, res: Response) => {
      res.status(HttpStatus.OK).json(GlobalResponseService.getSuccessfullyGlobalResponse<boolean>(true, APP_CONSTANTS.message.healthCheckSuccess()));
    });

    this._app.use(CONSTANTS.health.fullEndpoint, (req: Request, res: Response) => {
      res.status(HttpStatus.OK).json(GlobalResponseService.getSuccessfullyGlobalResponse<boolean>(true, APP_CONSTANTS.message.healthCheckSuccess()));
    });
  }
}
