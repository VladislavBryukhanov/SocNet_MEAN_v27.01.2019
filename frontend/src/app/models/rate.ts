export class Rate {
  public _id: string;
  public userId: string;
  public isPositive: boolean;
  public lastState: boolean;

  constructor(userId: string, isPositive: boolean) {
    this.userId = userId;
    this.isPositive = isPositive;
  }
}
