import {Image} from "./image";

export class Blog {
  _id: string;
  textContent: string;
  attachedFiles: Image[];
  date: Date;
  owner: string;
}
