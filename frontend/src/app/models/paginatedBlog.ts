import {Blog} from "./blog";
import {Paginated} from "./paginated";

export class PaginatedBlog extends Paginated {
  data: [Blog];
}
