import { gql } from '@apollo/client';

export const GET_ROOM_MESSAGES = gql`
  query ($roomId: String!) {
    getRoom(roomId: $roomId) {
      messages {
        id
        createdAt
        content
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_ROOM_MEMBERS = gql`
  query ($roomId: String!) {
    getRoom(roomId: $roomId) {
      members {
        username
        id
        pictureUrl
      }
    }
  }
`;

export const GET_ROOM = gql`
  query ($roomId: String!) {
    getRoom(roomId: $roomId) {
      id
      name
    }
  }
`;
