import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url } from '../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) { }

  base: string = url + '/pacientes';

  getPatient() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(this.base, { headers: headers });
  };

  addPatient(newPatientData: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(this.base, newPatientData, { headers: headers });
  };

  editPatient(patientId: string, editedPatientData: any) {
    let updateUrl = `${this.base}/${patientId}`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<any>(updateUrl, editedPatientData, { headers: headers });
  };

  deletePatient(patientId: string) {
    const url = `${this.base}/${patientId}`;
    return this.httpClient.delete<any>(url);
  };


}
