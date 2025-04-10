export interface User {
  id: number;
  username: string;
  type: 'user1' | 'user2' | 'user3' | 'user4' | 'user5';
}

export interface Admin {
  username: string;
  password: string;
}