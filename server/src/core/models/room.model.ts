import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

@ObjectType('Room')
export class RoomModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => Boolean)
  isPersistent: boolean;

  @Field(() => [UserModel])
  members: UserModel[];
}
