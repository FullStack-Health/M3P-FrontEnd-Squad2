import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthDate',
  standalone: true
})
export class BirthDatePipe implements PipeTransform {

  transform(value: string): string {
  //    return value[0]+value[1]+"/"+value[2]+value[3]+"/"+value[4]+value[5]+value[6]+value[7];
  if (!value) return ''; 

  const date = (typeof value === 'string') ? new Date(value) : value;

  if (isNaN(date.getTime())) return ''; 

  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 

  return `${day}/${month}/${year}`;
  }
}


