import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { EAuditActionType } from '../enums/audit-action-type.enum';

export class AddAuditLogDto {
  @IsOptional()
  @IsInt()
  public entityId?: number;

  @IsOptional()
  @IsString()
  public entityReference?: string;

  @IsString()
  @IsNotEmpty()
  public entityTableName!: string;

  @IsEnum(EAuditActionType)
  public actionType?: EAuditActionType;

  @IsOptional()
  @IsString()
  public actionDetail?: string;

  @IsOptional()
  @IsString()
  public userCode?: string;
}
