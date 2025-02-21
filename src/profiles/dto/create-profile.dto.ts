import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsInt()
  user_id: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
