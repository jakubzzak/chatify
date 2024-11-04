import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoomModel } from './room.model';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  pictureUrl?: string;

  @Field(() => [RoomModel])
  rooms: RoomModel[];
}
