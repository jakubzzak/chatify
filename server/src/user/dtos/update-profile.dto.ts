import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @ApiProperty({ required: true })
  username: string;
}
