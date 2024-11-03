import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { queryResolvers } from './resolvers';
import { FirebaseModule } from '@services/firebase/firebase.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
  ],
  providers: [...queryResolvers],
})
export class GraphqlModule {}
