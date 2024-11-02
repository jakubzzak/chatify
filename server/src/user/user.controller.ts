import { User } from '@core/decorators/user.decorator';
import { mapUser } from '@domains/user/mappers';
import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { FirebaseService } from '@services/firebase/firebase.service';
import { FirebaseCollections } from '@services/firebase/types';
import { UpdateProfileDto } from './dtos';
import { UserEntity } from './types';

@Controller({ path: '/api/profile' })
export class UserController {
  logger = new Logger(UserController.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getProfile(@User('id') userId: string): Promise<UserEntity> {
    const userSnapshot = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .where('uid', '==', userId)
      .get();
    if (userSnapshot.empty) {
      this.logger.warn(`User<${userId}> not found`);
      throw new NotFoundException(`User<${userId}> not found`);
    }

    if (userSnapshot.size > 1) {
      this.logger.error(
        `Data corruption, found ${userSnapshot.size} users by a single ID`,
        {
          userSnapshots: userSnapshot.docs.map((doc) => doc.data()),
        },
      );
      throw new Error('Data corruption, requires immediate attention');
    }

    return mapUser(userSnapshot.docs[0].data());
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
