import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ListUsersArgs } from '@services/graphql/args/list-users.args';
import { UserModel } from '@services/graphql/models';
import { RoomModel } from '@services/graphql/models/room.model';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';

@Resolver(() => UserModel)
export class UsersGqlQueryResolver {
  constructor(private readonly service: FirebaseService) {}

  @Query(() => [UserModel])
  async users(@Args() args: ListUsersArgs): Promise<UserModel[]> {
    const users = await this.service
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .where({
        username: args.username,
      })
      .get();

    return users.docs as unknown as UserModel[];
  }

  @ResolveField(() => [RoomModel])
  async rooms(@Parent() user: UserModel): Promise<RoomModel[]> {
    const rooms = await this.service
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .where('id', 'in', user.rooms)
      .get();

    return rooms.docs as unknown as RoomModel[];
  }
}
