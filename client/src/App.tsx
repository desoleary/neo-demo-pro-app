import { gql, useQuery } from '@apollo/client';
import React from 'react';

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      email
      tier
    }
  }
`;

export default function App() {
  const { data } = useQuery(GET_USER_PROFILE, { variables: { id: '1' } });
  return (
    <div>
      <h1>Neo Rewards Demo</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
