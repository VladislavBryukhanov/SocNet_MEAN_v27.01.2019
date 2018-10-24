export enum ItemsType {
  post = 1,
  photo = 2,
  comment = 3
}

export class Rate {
  public userId: string;
  public isPositive: boolean;
  public itemType: number;
  public itemId: string;
  public lastState: boolean;

  constructor(userId: string, isPositive: boolean, itemType: number, itemId: string) {
    this.userId = userId;
    this.isPositive = isPositive;
    this.itemType = itemType;
    this.itemId = itemId;
  }
}
