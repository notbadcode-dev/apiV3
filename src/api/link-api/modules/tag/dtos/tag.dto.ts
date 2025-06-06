import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class TagDto {
  @IsInt()
  public id!: number;

  @IsString()
  public name!: string;

  @IsOptional()
  @IsString()
  public emoji?: string;

  @IsInt()
  @Min(0)
  public colorRgb!: number;

  @IsInt()
  @IsPositive()
  public userId!: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  public linkId?: number;
}
