import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.res';

export class RoomResponse {
  constructor({
    id,
    createdAt,
    name,
    code,
  }: {
    id: string;
    createdAt: string;
    name: string;
    code: string;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.name = name;
    this.code = code;
    this.members = [];
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  members: UserResponse[];
}
