import { gql } from "@apollo/client";

// User Operations
export const GET_USERS = gql`
  query GetUsers($first: Int, $after: String, $orderBy: OrderByInput, $filter: UserFilterInput) {
    users(first: $first, after: $after, orderBy: $orderBy, filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          _id
          id
          email
          tier
        }
        cursor
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($identifier: UserIdentifierInput!) {
    user(identifier: $identifier) {
      _id
      id
      email
      password
      tier
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($id: String!, $email: String!, $password: String!, $tier: String!) {
    createUser(id: $id, email: $email, password: $password, tier: $tier) {
      _id
      id
      email
      tier
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $email: String, $password: String, $tier: String) {
    updateUser(id: $id, email: $email, password: $password, tier: $tier) {
      _id
      id
      email
      tier
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

// Account Operations
export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: ID!, $first: Int, $after: String, $orderBy: OrderByInput, $filter: AccountFilterInput) {
    accounts(userId: $userId, first: $first, after: $after, orderBy: $orderBy, filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          _id
          type
          balance
          userId
        }
        cursor
      }
    }
  }
`;

export const GET_ACCOUNT = gql`
  query GetAccount($id: String!) {
    account(id: $id) {
      _id
      userId
      type
      balance
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($userId: String!, $type: String!, $balance: Float!) {
    createAccount(userId: $userId, type: $type, balance: $balance) {
      _id
      userId
      type
      balance
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: String!, $userId: String, $type: String, $balance: Float) {
    updateAccount(id: $id, userId: $userId, type: $type, balance: $balance) {
      _id
      userId
      type
      balance
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: String!) {
    deleteAccount(id: $id)
  }
`;

// Reward Operations
export const GET_REWARDS = gql`
  query GetRewards($first: Int, $after: String, $orderBy: OrderByInput, $filter: RewardFilterInput) {
    rewards(first: $first, after: $after, orderBy: $orderBy, filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          _id
          id
          description
          points
        }
        cursor
      }
    }
  }
`;

export const GET_REWARD = gql`
  query GetReward($id: String!) {
    reward(id: $id) {
      _id
      id
      description
      points
    }
  }
`;

export const CREATE_REWARD = gql`
  mutation CreateReward($id: String!, $description: String!, $points: Float!) {
    createReward(id: $id, description: $description, points: $points) {
      _id
      id
      description
      points
    }
  }
`;

export const UPDATE_REWARD = gql`
  mutation UpdateReward($id: String!, $description: String, $points: Float) {
    updateReward(id: $id, description: $description, points: $points) {
      _id
      id
      description
      points
    }
  }
`;

export const DELETE_REWARD = gql`
  mutation DeleteReward($id: String!) {
    deleteReward(id: $id)
  }
`;

// Transfer Operations
export const GET_TRANSFERS = gql`
  query GetTransfers($first: Int, $after: String, $orderBy: OrderByInput, $filter: TransferFilterInput) {
    transfers(first: $first, after: $after, orderBy: $orderBy, filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          _id
          id
          status
        }
        cursor
      }
    }
  }
`;

export const GET_TRANSFER = gql`
  query GetTransfer($id: String!) {
    transfer(id: $id) {
      _id
      id
      status
    }
  }
`;

export const CREATE_TRANSFER = gql`
  mutation CreateTransfer($id: String!, $status: String!) {
    createTransfer(id: $id, status: $status) {
      _id
      id
      status
    }
  }
`;

export const UPDATE_TRANSFER = gql`
  mutation UpdateTransfer($id: String!, $status: String) {
    updateTransfer(id: $id, status: $status) {
      _id
      id
      status
    }
  }
`;

export const DELETE_TRANSFER = gql`
  mutation DeleteTransfer($id: String!) {
    deleteTransfer(id: $id)
  }
`;

