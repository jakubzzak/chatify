import { User } from '@core/decorators/user.decorator';
import { UserEntity } from '@domains/user/types';
import { ConflictException } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserModel } from '@services/graphql/models';
import { MessageModel } from '@services/graphql/models/message.model';
import { mapMessageResponse } from '@services/graphql/res/message.res';
import { mapUserResponse } from '@services/graphql/res/user.res';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import {
  FirebaseCollections,
  FirebaseRoomSubCollections,
} from 'src/services/firebase/types';

@Resolver(() => MessageModel)
export class MessagesGqlQueryResolver {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Query(() => [MessageModel])
  async listMessages(
    @User() user: UserEntity,
    @Args('roomId', { type: () => String }) roomId: string,
  ) {
    if (!user.rooms.includes(roomId)) {
      throw new ConflictException(`not a member of Room<${roomId}>`);
    }

    const messageDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(roomId)
      .collection(FirebaseRoomSubCollections.Messages)
      .withConverter(this.firebaseService.messageConverter())
      .orderBy('createdAt')
      .get();

    return messageDocs.docs.map(mapMessageResponse);
  }

  @ResolveField(() => UserModel)
  async user(@Parent() message: MessageModel) {
    const userDoc = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .withConverter(this.firebaseService.userConverter())
      .doc(message['userId'])
      .get();

    return mapUserResponse(userDoc);
  }
}
