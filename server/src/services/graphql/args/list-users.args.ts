import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ListUsersArgs {
  @Field(() => String)
  username: string;
}
