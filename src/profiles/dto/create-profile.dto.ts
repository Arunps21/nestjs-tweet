import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { number } from 'joi';

export class CreateProfileDto {
  @IsInt()
  @Type(()=>Number)
  user_id: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string | null;
}
