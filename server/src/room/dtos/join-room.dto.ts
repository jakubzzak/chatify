import { IsOptional, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
