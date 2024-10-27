import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrUpdateRoomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isPersistent?: boolean;
}
