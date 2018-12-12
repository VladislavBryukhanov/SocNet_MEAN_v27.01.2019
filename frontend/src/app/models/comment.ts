import {User} from './user';

export class Comment {
  _id: string;
  textContent: string;
  attachedFiles: string[];
  date: Date;
  public userId: string;
  public itemId: string;
  public user: User;
}
