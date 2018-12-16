import {Image} from './image';

export class User {
  _id: string;
  login: string;
  username: string;
  password: string;
  avatar: Image;
  bio: string;

  constructor(login: string, username: string, password: string) {
    this.login = login;
    this.username = username;
    this.password = password;
  }
}
