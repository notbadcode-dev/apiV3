import { CreateTagRequestDto } from '../dtos/create-tag.dto';
import { TagDto } from '../dtos/tag.dto';

export interface ITagService {
  create(dto: CreateTagRequestDto): Promise<TagDto | null>;

  //   findAllByUser(userId: number): Promise<Tag[]>;

  //   rename(id: number, dto: RenameTagDto): Promise<Tag>;

  //   changeEmoji(id: number, dto: ChangeEmojiDto): Promise<Tag>;

  //   changeColor(id: number, dto: ChangeColorDto): Promise<Tag>;

  //   delete(id: number): Promise<void>;
}
