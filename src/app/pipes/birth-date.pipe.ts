import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthDate',
  standalone: true
})
export class BirthDatePipe implements PipeTransform {

  transform(value: string): string {
    const year = value.slice(0, 4);
    const month = value.slice(5, 7);
    const day = value.slice(8, 10);
    
    // Retorna no formato 'dd/MM/yyyy'
    return `${day}/${month}/${year}`;
    //return value[0]+value[1]+"/"+value[2]+value[3]+"/"+value[4]+value[5]+value[6]+value[7];
  }

}
