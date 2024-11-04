import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoomModel } from './room.model';
import { UserModel } from './user.model';

@ObjectType('Message')
export class MessageModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => String)
  content: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => RoomModel)
  room: RoomModel;
}
