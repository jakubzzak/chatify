import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MessageModel } from './message.model';
import { UserModel } from './user.model';

@ObjectType('Room')
export class RoomModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  admin: string;

  @Field(() => Boolean)
  isPrivate: boolean;

  @Field(() => Boolean)
  isPersistent: boolean;

  @Field(() => [UserModel])
  members: UserModel[];

  @Field(() => MessageModel, { nullable: true })
  lastMessage: MessageModel | null;
}
