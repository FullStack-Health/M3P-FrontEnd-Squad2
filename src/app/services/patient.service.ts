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
  prontuarios: string = '/prontuarios';


  getPatientPronturarioIndividual(patientId : any) { //pacientes/id/prontuarios
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`${this.base}/${patientId}/${this.prontuarios}`, { headers: headers });
  };


  getPatientPronturario(patientId : any) { //pacientes/id
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`${this.base}/${patientId}`, { headers: headers });
  };

  getListaPronturario() {  //pacientes/pronturarios
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`${this.base}${this.prontuarios}`, { headers: headers });
  };

   
  getPatient() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Lista de pacientes
    return this.httpClient.get<any>(`${this.base}`, { headers: headers });
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
