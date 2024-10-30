import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatterIn',
  standalone: true
})
export class DateFormatInPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return '' }
    const [year, month, day] = value.split('T')[0].split('-');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

}
