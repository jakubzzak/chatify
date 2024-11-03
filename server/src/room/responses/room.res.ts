import { ApiProperty } from '@nestjs/swagger';
import { RoomMessageResponse } from './message.res';
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

  @ApiProperty()
  messages: RoomMessageResponse[];
}
