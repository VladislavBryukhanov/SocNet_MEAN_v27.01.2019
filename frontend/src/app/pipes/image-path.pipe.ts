import { Pipe, PipeTransform } from '@angular/core';
import {Image} from '../models/image';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagePath'
})
export class ImagePathPipe implements PipeTransform {

  transform(avatar: Image): string {
    return `${environment.hostUrl}/${avatar.filePath}${avatar.fileName}`;
  }

}
