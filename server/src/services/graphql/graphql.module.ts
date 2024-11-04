import { RoomModule } from '@domains/room/room.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { join } from 'path';
import { queryResolvers } from './resolvers';

@Module({
  imports: [
    FirebaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/services/graphql/schema.gql'),
      sortSchema: true,
    }),
    RoomModule,
  ],
  providers: [...queryResolvers],
})
export class GraphqlModule {}
