import { MessagesGqlQueryResolver } from './queries/messages.gql-query-resolver';
import { RoomsGqlQueryResolver } from './queries/rooms.gql-query-resolver';
import { UsersGqlQueryResolver } from './queries/users.gql-query-resolver';

export const queryResolvers = [
  RoomsGqlQueryResolver,
  MessagesGqlQueryResolver,
  UsersGqlQueryResolver,
];
