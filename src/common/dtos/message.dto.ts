import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { MESSAGE_CONSTANTS } from '../constants/message.constants';
import { EMessageType } from '../enums/message-type.enum';

export class MessageDto {
  @IsEnum(EMessageType)
  public type!: EMessageType;

  @IsString()
  @MaxLength(MESSAGE_CONSTANTS.maxLengthMessage)
  public message!: string;

  @IsOptional()
  public translateArguments?: Record<string, unknown>;
}
