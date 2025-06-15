import { OmitType } from '@nestjs/mapped-types';

export class TranslateOptionsWithArgumentsDto {
  public key!: string;
  public args?: Record<string, unknown>;
  public lang!: string;
}

export class TranslateOptionsWithoutArgumentsDto extends OmitType(TranslateOptionsWithArgumentsDto, ['args', 'lang'] as const) {}
