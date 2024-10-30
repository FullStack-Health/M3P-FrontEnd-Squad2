import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private httpClient: HttpClient) { }

  base: string = url + '/exames';

  getExam() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(this.base, {headers: headers});
  };

  addExam(newExamData: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(this.base, newExamData, { headers: headers });
  };

  editExam(examId: string, editedExamData: any) {
    let updateUrl = `${this.base}/${examId}`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<any>(updateUrl, editedExamData, { headers: headers });
  };

  deleteExam(examId: string) {
    const url = `${this.base}/${examId}`;
    return this.httpClient.delete<any>(url);
  };

}
