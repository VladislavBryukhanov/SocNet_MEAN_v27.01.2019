import {Image} from "./image";
import {PaginatedComments} from "./paginatedComments";
import {FullRateInfo} from "./fullRateInfo";

export class Blog {
  _id: string;
  textContent: string;
  attachedFiles: Image[];
  date: Date;
  owner: string;
  rate: FullRateInfo;
  comments: PaginatedComments;
}
