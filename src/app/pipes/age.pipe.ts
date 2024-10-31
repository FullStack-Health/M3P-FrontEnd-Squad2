import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(birthdateStr: string): any {
    if (!birthdateStr) {
      return null;
    }
    const birthdate = this.convertToDate(birthdateStr);
    const age = this.calculateAge(birthdate);
    return age;
  }

  private convertToDate(birthdateStr: string): Date {
    const [datePart] = birthdateStr.split(" "); 
    const [year, month, day] = datePart.split("-").map(part => parseInt(part, 10)); 
    return new Date(year, month - 1, day);
  };
  
  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  };


}

