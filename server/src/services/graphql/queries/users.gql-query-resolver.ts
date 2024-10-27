import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListUsersArgs } from 'src/core/args/list-users.args';
import { UserModel } from 'src/core/models';
import { UserModule } from 'src/modules/user.module';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';
// import { GetStationsArgs } from '~/core/args';
// import { StationModel } from '~/core/models';
// import { StationService } from '~/core/services';

@Resolver()
export class UsersGqlQueryResolver {
  constructor(private readonly service: FirebaseService) {}

  @Query(() => [UserModule])
  public async users(@Args() args: ListUsersArgs): Promise<UserModel[]> {
    const users = await this.service
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .where({
        username: args.username,
      })
      .get();

    return users.docs as unknown as UserModel[];
  }
}
