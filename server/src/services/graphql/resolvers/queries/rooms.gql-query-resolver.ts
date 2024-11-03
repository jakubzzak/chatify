import { User } from '@core/decorators/user.decorator';
import { Room } from '@core/types';
import { UserEntity } from '@domains/user/types';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ListRoomsArgs } from '@services/graphql/args/list-rooms.args';
import { UserModel } from '@services/graphql/models';
import { RoomModel } from '@services/graphql/models/room.model';
import { FieldPath, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';

@Resolver(() => RoomModel)
export class RoomsGqlQueryResolver {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Query(() => [RoomModel])
  async rooms(
    @User() user: UserEntity,
    @Args() args: ListRoomsArgs,
  ): Promise<RoomModel[]> {
    if (args.type === 'member') {
      const roomDocs = await this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Rooms)
        .withConverter(this.firebaseService.roomConverter())
        .where(FieldPath.documentId(), 'in', user.rooms)
        .orderBy('name')
        .get();

      return roomDocs.docs.map(this.mapRoomResponse);
    }

    if (args.type === 'not_member') {
      const roomDocs = await this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Rooms)
        .withConverter(this.firebaseService.roomConverter())
        .where('code', '==', null)
        .where(FieldPath.documentId(), 'not-in', user.rooms)
        .orderBy('name')
        .get();

      return roomDocs.docs.map(this.mapRoomResponse);
    }

    const roomDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .where('code', '==', null)
      .orderBy('name')
      .get();

    return roomDocs.docs.map(this.mapRoomResponse);
  }

  @ResolveField(() => [UserModel])
  async members(@Parent() room: RoomModel): Promise<UserModel[]> {
    const users = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .where('uid', 'in', room.members)
      .get();

    return users.docs as unknown as UserModel[];
  }

  private mapRoomResponse = (
    roomDoc: QueryDocumentSnapshot<Omit<Room, 'id'>>,
  ) => {
    const { code, ...data } = roomDoc.data();
    return {
      id: roomDoc.id,
      isPrivate: !!code,
      ...data,
      createdAt: data.createdAt ?? roomDoc.createTime.toDate().toISOString(),
      members: data.members as unknown as UserModel[],
    };
  };
}
