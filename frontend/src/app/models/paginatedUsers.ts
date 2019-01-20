import {User} from "./user";
import {Paginated} from "./paginated";

export class PaginatedUsers extends Paginated {
  data: [User];
}
