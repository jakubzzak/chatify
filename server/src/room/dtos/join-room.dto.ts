import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;
}
