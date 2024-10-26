import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserController } from 'src/controllers/user.controller';
import { FirebaseModule } from './firebase.module';

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
