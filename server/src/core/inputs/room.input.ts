import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrUpdateRoomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string;
}
