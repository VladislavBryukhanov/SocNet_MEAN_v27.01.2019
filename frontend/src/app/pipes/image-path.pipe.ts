import { Pipe, PipeTransform } from '@angular/core';
import {AuthInterceptor} from '../modules/authInterceptor';

@Pipe({
  name: 'imagePath'
})
export class ImagePathPipe implements PipeTransform {

  transform(value: string): string {
    return `${AuthInterceptor.hostUrl}/${value}`;
  }

}
