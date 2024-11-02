import { ApiProperty } from '@nestjs/swagger';
import { RoomMemberResponse } from './user.res';

export class RoomResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isPersistent: boolean;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  members: RoomMemberResponse[];
}
