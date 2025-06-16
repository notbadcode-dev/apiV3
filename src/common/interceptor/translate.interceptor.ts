import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { TranslateService } from '@common/modules/translate/services/translate.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(private readonly _translateService: TranslateService) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(async (response: GlobalResponseDto) => {
        if (!response?.messageList?.length || !Array.isArray(response.messageList)) {
          return response;
        }

        for (const MESSAGE of response.messageList) {
          if (typeof MESSAGE.message === 'string') {
            MESSAGE.message = await this._translateService.translateWithoutArguments(MESSAGE.message);
          }
        }

        return response;
      }),
      map((promise) => (promise instanceof Promise ? promise.then((r) => r) : promise)),
    );
  }
}
