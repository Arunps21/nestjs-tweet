import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTweetDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
