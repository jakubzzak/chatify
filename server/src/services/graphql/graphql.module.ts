import { RoomModule } from '@domains/room/room.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { queryResolvers } from './resolvers';

@Module({
  imports: [
    FirebaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // lambda does not support autoSchemaFile as a path
      // autoSchemaFile: join(process.cwd(), 'src/services/graphql/schema.gql'),
      sortSchema: true,
    }),
    RoomModule,
  ],
  providers: [...queryResolvers],
})
export class GraphqlModule {}
