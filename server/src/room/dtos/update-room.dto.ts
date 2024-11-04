import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPersistent?: boolean;
}
