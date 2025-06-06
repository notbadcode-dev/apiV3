import { LogMethod } from '@common/decorators/logged-method.decorator';
import { LinkTag } from '@link-api/modules/tag/entities/link-tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { ITagService } from './tag.service.interface';
import { CreateTagRequestDto } from '../dtos/create-tag.dto';
import { TagDto } from '../dtos/tag.dto';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagService implements ITagService {
  constructor(
    @InjectRepository(Tag)
    private readonly _tagRepository: Repository<Tag>,

    @InjectRepository(LinkTag)
    private readonly _linkTagRepository: Repository<LinkTag>,
  ) {}

  @LogMethod
  public async create(dto: CreateTagRequestDto): Promise<TagDto | null> {
    const TAG_ENTITY = await this._tagRepository.findOne({
      where: { name: dto.name, userId: dto.userId },
    });

    if (TAG_ENTITY) {
      return plainToClass(TagDto, TAG_ENTITY, { excludeExtraneousValues: true });
    }

    const CREATED_TAG = this._tagRepository.create(dto);
    const SAVED_TAG = await this._tagRepository.save(CREATED_TAG);

    if (dto.linkId) {
      const LINK_TAG_ENTITY = {
        linkId: dto.linkId,
        tagId: SAVED_TAG.id,
      };

      const LINK_TAG_CREATED = this._linkTagRepository.create(LINK_TAG_ENTITY);

      await this._linkTagRepository.save(LINK_TAG_CREATED);
    }

    return plainToClass(TagDto, CREATED_TAG, { excludeExtraneousValues: true });
  }
}
