import { PickType } from '@nestjs/mapped-types';

import { TagDto } from './tag.dto';

export class ChangeColorDto extends PickType(TagDto, ['colorRgb'] as const) {}
