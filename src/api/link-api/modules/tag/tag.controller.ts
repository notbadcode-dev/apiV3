import { GlobalResponseService } from '@common/utils/global-response.service';
import { CreateTagRequestDto, CreateTagResponseDto } from '@link-api/modules/tag/dtos/create-tag.dto';
import { TagDto } from '@link-api/modules/tag/dtos/tag.dto';
import { TagService } from '@link-api/modules/tag/services/tag.service';
import { Body, Controller, Post } from '@nestjs/common';

import { TAG_CONSTANTS } from './constants/tag.constants';

@Controller('tag')
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @Post('create')
  // @UseGuards(JwtAuthGuard)
  public async create(@Body() request: CreateTagRequestDto): Promise<CreateTagResponseDto> {
    const DATA: TagDto | null = await this._tagService.create(request);
    const RESPONSE: CreateTagResponseDto = GlobalResponseService.getSuccessfullyGlobalResponse(DATA, TAG_CONSTANTS.messages.tagCreatedSuccessfully());

    return RESPONSE;
  }
}
