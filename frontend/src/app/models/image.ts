export class Image {
  _id: string;
  filePath: string;
  fileName: string;

  constructor(filePath: string, fileName: string) {
    this.filePath = filePath;
    this.fileName = fileName;
  }
}
