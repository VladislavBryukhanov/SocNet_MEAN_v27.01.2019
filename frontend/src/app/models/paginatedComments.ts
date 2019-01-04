import {Paginated} from "./paginated";
import {Comment} from "./comment";

export class PaginatedComments extends Paginated {
  data: [Comment];
  isCommentedByMe: boolean;
}
