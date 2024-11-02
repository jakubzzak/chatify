import { Module } from '@nestjs/common';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    FirebaseModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   // playground: false,
    //   autoSchemaFile: 'schema.gql',
    //   sortSchema: true,
    // }),
  ],
  controllers: [UserController],
})
export class UserModule {}
