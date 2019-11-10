import { Image } from './image';
import { User } from './user';

export interface Chat {
  _id: string;
  name?: string;
  users: User[];
  avatar?: Image;
}

interface BaseMessage {
  _id: string;
  attachedFiles: Image[];
  textContent: string;
  date: Date;
}

export interface Message extends BaseMessage {
  user: string;
}

export interface MessageNotification extends BaseMessage {
  user: User;
}

export interface LocalMessage {
  attachedFiles: Image[];
  textContent: string;
  sender: string;
}
