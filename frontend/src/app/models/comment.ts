import {User} from './user';
import {Image} from "./image";

export class Comment {
  _id: string;
  textContent: string;
  attachedFiles: Image[];
  date: Date;
  public userId: string;
  public itemId: string;
  public user: User;
}
