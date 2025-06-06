import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { OmitType } from '@nestjs/mapped-types';

import { TagDto } from './tag.dto';

export class CreateTagRequestDto extends OmitType(TagDto, ['id'] as const) {}

export class CreateTagResponseDto extends GlobalResponseDto<TagDto | null> {}
