import { Pipe, PipeTransform } from '@angular/core';
import {AuthInterceptor} from '../modules/authInterceptor';
import {Image} from '../models/image';

@Pipe({
  name: 'imagePath'
})
export class ImagePathPipe implements PipeTransform {

  transform(avatar: Image): string {
    return `${AuthInterceptor.hostUrl}/${avatar.filePath}${avatar.fileName}`;
  }

}
