import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatOut',
  standalone: true
})
export class DateFormatOutPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return '' }

    const day = value.slice(0, 2);
    const month = value.slice(2, 4);
    const year = value.slice(4, 8);
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

}
