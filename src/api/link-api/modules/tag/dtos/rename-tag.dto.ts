import { PickType } from '@nestjs/mapped-types';

import { TagDto } from './tag.dto';

export class RenameTagDto extends PickType(TagDto, ['name'] as const) {}
