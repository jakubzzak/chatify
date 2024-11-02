import { ApiProperty } from '@nestjs/swagger';

export class RoomMemberResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;
}
