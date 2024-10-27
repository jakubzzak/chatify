import { ApiProperty } from '@nestjs/swagger';

export class RoomResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  isPersistent: boolean;

  @ApiProperty()
  members: string[];
}
