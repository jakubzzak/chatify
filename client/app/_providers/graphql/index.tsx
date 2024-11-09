'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth } from '@/app/_providers/auth';

type GraphqlProviderState = {
  client: ApolloClient<NormalizedCacheObject>;
};

const initialState = {
  client: null,
};

const GraphqlProviderContext =
  createContext<GraphqlProviderState>(initialState);

export function GraphqlProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [client] = useState(
    new ApolloClient({
      uri: process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql',
      cache: new InMemoryCache(),
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return (
    <GraphqlProviderContext.Provider value={{ client }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </GraphqlProviderContext.Provider>
  );
}

export const useGraphql = () => {
  const context = useContext(GraphqlProviderContext);

  if (context === undefined)
    throw new Error('useGraphql must be used within a GraphqlProvider');

  return context;
};
