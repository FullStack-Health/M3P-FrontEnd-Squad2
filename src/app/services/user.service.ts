import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  urlpath: string = `${url}/usuarios`;

  addQuickUser(newUserData: any) {
    let updateUrl = `${this.urlpath}/pre-registro`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(updateUrl, newUserData, { headers: headers });
  }


 
}
