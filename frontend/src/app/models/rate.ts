export class Rate {
  public _id: string;
  public userId: string;
  public isPositive: boolean;
  public itemId: string;
  public lastState: boolean;

  constructor(userId: string, isPositive: boolean, itemId: string) {
    this.userId = userId;
    this.isPositive = isPositive;
    this.itemId = itemId;
  }
}
