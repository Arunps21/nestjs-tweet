import { IsInt, IsNotEmpty } from "class-validator";

export class CreateLikeDto {
    @IsInt()
    @IsNotEmpty()
    tweet_id: number;
  
    @IsInt()
    user_id: number;
  }