import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { url } from '../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private httpClient: HttpClient) { }

  base: string = url + '/consultas';

  getConsultation() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(this.base, {headers: headers});
  };

  addConsultation(newConsultationData: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(this.base, newConsultationData, { headers: headers });
  };

  editConsultation(consultationId: string, editedConsultationData: any) {
    let updateUrl = `${this.base}/${consultationId}`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<any>(updateUrl, editedConsultationData, { headers: headers });
  };

  deleteConsultation(consultationId: string) {
    const url = `${this.base}/${consultationId}`;
    return this.httpClient.delete<any>(url);
  };

}