import { Pipe, PipeTransform } from '@angular/core';
import {Image} from "../models/image";

@Pipe({
  name: 'imageResizer'
})
export class ImageResizerPipe implements PipeTransform {

  transform(image: Image, mode: string): Image {
    let {fileName} = image;
    fileName = `${mode}.${fileName}`;
    return {
      ...image, fileName
    };
  }
}
