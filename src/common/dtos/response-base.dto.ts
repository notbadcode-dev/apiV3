import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

import { MessageDto } from './message.dto';

export class GlobalResponseDto<T = null> {
  @Type(() => Object)
  public data: T | null = null;

  @IsArray()
  @Type(() => MessageDto)
  public messageList: MessageDto[] = [];
}
