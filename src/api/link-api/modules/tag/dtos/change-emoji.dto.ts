import { PickType } from '@nestjs/mapped-types';

import { TagDto } from './tag.dto';

export class ChangeEmojiDto extends PickType(TagDto, ['emoji'] as const) {}
