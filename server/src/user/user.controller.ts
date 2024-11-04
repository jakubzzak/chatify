import { User } from '@core/decorators/user.decorator';
import { Body, Controller, Get, Logger, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseService } from '@services/firebase/firebase.service';
import { FirebaseCollections } from '@services/firebase/types';
import { FieldPath } from 'firebase-admin/firestore';
import { UpdateProfileDto } from './dtos';
import { UserEntity } from './types';

@Controller({ path: '/api/profile' })
@ApiTags('profile')
export class UserController {
  logger = new Logger(UserController.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getProfile(@User() user: UserEntity): Promise<UserEntity> {
    if (Array.isArray(user.rooms) && user.rooms.length > 0) {
      const userRooms = await this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Rooms)
        .where(FieldPath.documentId(), 'in', user.rooms)
        .get();

      user.rooms = userRooms.docs
        .map((room) => ({
          id: room.id,
          createdAt: room.createTime.toDate().toISOString(),
          updatedAt: room.updateTime.toDate().toISOString(),
          name: room.data().name as string,
          isPersistent: room.data().isPersistent === true,
        }))
        .sort((one, two) => (one.updatedAt < two.updatedAt ? 1 : -1));
    }
    return user;
  }

  @Patch()
  async updateProfile(
    @User() user: UserEntity,
    @Body() body: UpdateProfileDto,
  ): Promise<UserEntity> {
    await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .doc(user.id)
      .update({
        username: body.username,
      });
    return { ...user, username: body.username };
  }
}
