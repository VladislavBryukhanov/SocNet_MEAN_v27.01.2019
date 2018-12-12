import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageResizer'
})
export class ImageResizerPipe implements PipeTransform {

  transform(value: string, mode: string): string {
    return `${mode}.${value}`;
  }

}
