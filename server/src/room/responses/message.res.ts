import { ApiProperty } from '@nestjs/swagger';

export class RoomMessageResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  content: string;
}
