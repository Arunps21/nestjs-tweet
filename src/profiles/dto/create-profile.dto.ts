import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { number } from 'joi';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string | null;
}
