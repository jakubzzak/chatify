import { User } from '@core/decorators/user.decorator';
import { UserEntity } from '@domains/user/types';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserModel } from '@services/graphql/models';
import { RoomModel } from '@services/graphql/models/room.model';
import { mapRoomResponse } from '@services/graphql/res/room.res';
import { mapUserResponse } from '@services/graphql/res/user.res';
import { FieldPath } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';

@Resolver(() => UserModel)
export class UsersGqlQueryResolver {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Query(() => UserModel)
  async getProfile(@User() user: UserEntity) {
    const userDoc = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .withConverter(this.firebaseService.userConverter())
      .doc(user.id)
      .get();

    return mapUserResponse(userDoc);
  }

  @Mutation(() => UserModel)
  async updateProfile(
    @User() user: UserEntity,
    @Args('username') username: string,
  ) {
    const userRef = this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .withConverter(this.firebaseService.userConverter())
      .doc(user.id);

    await userRef.update({ username });

    const userDoc = await userRef.get();
    return mapUserResponse(userDoc);
  }

  @ResolveField(() => [RoomModel])
  async rooms(@Parent() user: UserModel) {
    const rooms = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .where(FieldPath.documentId(), 'in', user.rooms)
      .get();

    return rooms.docs.map(mapRoomResponse);
  }
}
